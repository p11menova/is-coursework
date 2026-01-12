package com.newsaggregator.rssparser.service

import com.newsaggregator.rssparser.model.News
import com.newsaggregator.rssparser.model.Source
import com.newsaggregator.rssparser.repository.NewsRepository
import com.newsaggregator.rssparser.repository.SourceRepository
import com.rometools.rome.feed.synd.SyndEntry
import com.rometools.rome.feed.synd.SyndFeed
import com.rometools.rome.io.SyndFeedInput
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.InputStreamReader
import java.net.URL
import java.time.LocalDateTime
import java.time.ZoneId

@Service
class RssParserService(
    private val sourceRepository: SourceRepository,
    private val newsRepository: NewsRepository
) {
    @Transactional
    fun parseAllSources() {
        val sources = sourceRepository.findAll()
        sources.forEach { source ->
            try {
                parseSource(source)
            } catch (e: Exception) {
                println("Ошибка парсинга источника ${source.name}: ${e.message}")
            }
        }
    }

    private fun parseSource(source: Source) {
        val feedUrl = URL(source.rssUrl)
        val input = SyndFeedInput()
        
        // Исправляем кодировку для drom.ru и других источников
        val connection = feedUrl.openConnection()
        connection.setRequestProperty("User-Agent", "Mozilla/5.0")
        val inputStream = connection.getInputStream()
        val reader = if (source.rssUrl.contains("drom.ru")) {
            // drom.ru использует Windows-1251
            InputStreamReader(inputStream, "Windows-1251")
        } else {
            InputStreamReader(inputStream, "UTF-8")
        }
        val feed: SyndFeed = input.build(reader)

        feed.entries.forEach { entry ->
            try {
                // Проверяем, не существует ли уже такая новость
                val url = entry.link ?: return@forEach
                val existingNews = newsRepository.findByUrl(url)
                if (existingNews != null) {
                    // Обновляем существующую новость (изображения и форматирование)
                    updateExistingNews(existingNews, entry, source)
                    return@forEach
                }

                val news = createNews(entry, source)
                newsRepository.save(news)
            } catch (e: Exception) {
                println("Ошибка обработки новости: ${e.message}")
            }
        }
    }
    
    private fun updateExistingNews(existingNews: News, entry: SyndEntry, source: Source) {
        val rawContent = entry.description?.value ?: ""
        val content = cleanHtmlContent(rawContent)
        
        // Обновляем только контент, не изображения
        if (content.isNotEmpty() && existingNews.content.isEmpty()) {
            existingNews.content = content
        }
        // Убираем изображения если они были
        existingNews.imageUrl = null
        newsRepository.save(existingNews)
    }

    private fun createNews(entry: SyndEntry, source: Source): News {
        val publishedDate = entry.publishedDate?.toInstant()
            ?.atZone(ZoneId.systemDefault())
            ?.toLocalDateTime()
            ?: LocalDateTime.now()

        val rawContent = entry.description?.value ?: ""
        // Очищаем HTML из контента, оставляем только текст
        val content = cleanHtmlContent(rawContent)
        // Не парсим изображения - используем логотип источника

        val category = source.category ?: throw IllegalStateException("Источник ${source.name} не имеет категории")

        val news = News()
        news.title = entry.title ?: "Без заголовка"
        news.content = content
        news.url = entry.link ?: ""
        news.imageUrl = null // Не используем картинки новостей
        news.publishedDate = publishedDate
        news.source = source
        news.category = category // Новость наследует категорию от источника
        return news
    }

    private fun extractImageUrl(content: String, fallbackUrl: String): String? {
        // Ищем изображение в HTML контенте
        val imgPattern = Regex("<img[^>]+src=[\"']([^\"']+)[\"']", setOf(RegexOption.IGNORE_CASE))
        val match = imgPattern.find(content)
        if (match != null) {
            var imageUrl = match.groupValues[1]
            // Обрабатываем относительные URL
            if (imageUrl.startsWith("//")) {
                imageUrl = "https:$imageUrl"
            } else if (imageUrl.startsWith("/") && !imageUrl.startsWith("http")) {
                // Пытаемся извлечь базовый URL из fallbackUrl
                try {
                    val baseUrl = URL(fallbackUrl)
                    imageUrl = "${baseUrl.protocol}://${baseUrl.host}$imageUrl"
                } catch (e: Exception) {
                    // Игнорируем ошибки парсинга URL
                }
            }
            // Проверяем, что это действительно изображение
            if (imageUrl.matches(Regex(".*\\.(jpg|jpeg|png|gif|webp|svg)", setOf(RegexOption.IGNORE_CASE))) || 
                imageUrl.contains("image") || 
                imageUrl.contains("photo") ||
                imageUrl.contains("img") ||
                imageUrl.contains("habrastorage") ||
                imageUrl.contains("static")) {
                return imageUrl
            }
        }
        
        // Ищем в медиа-контенте (если есть)
        val mediaPattern = Regex("<media:content[^>]+url=[\"']([^\"']+)[\"']", setOf(RegexOption.IGNORE_CASE))
        val mediaMatch = mediaPattern.find(content)
        if (mediaMatch != null) {
            val url = mediaMatch.groupValues[1]
            if (url.matches(Regex(".*\\.(jpg|jpeg|png|gif|webp|svg)", setOf(RegexOption.IGNORE_CASE)))) {
                return url
            }
        }
        
        // Ищем в enclosure (для подкастов и медиа)
        val enclosurePattern = Regex("<enclosure[^>]+url=[\"']([^\"']+)[\"']", setOf(RegexOption.IGNORE_CASE))
        val enclosureMatch = enclosurePattern.find(content)
        if (enclosureMatch != null) {
            val url = enclosureMatch.groupValues[1]
            // Проверяем, что это изображение
            if (url.matches(Regex(".*\\.(jpg|jpeg|png|gif|webp|svg)", setOf(RegexOption.IGNORE_CASE)))) {
                return url
            }
        }
        
        // Ищем в og:image мета-тегах (если контент содержит HTML)
        val ogImagePattern = Regex("<meta[^>]+property=[\"']og:image[\"'][^>]+content=[\"']([^\"']+)[\"']", setOf(RegexOption.IGNORE_CASE))
        val ogImageMatch = ogImagePattern.find(content)
        if (ogImageMatch != null) {
            return ogImageMatch.groupValues[1]
        }
        
        return null
    }

    private fun cleanHtmlContent(html: String): String {
        if (html.isEmpty()) return ""
        
        // Оставляем базовое форматирование: параграфы, переносы строк, жирный текст
        var text = html
            .replace(Regex("<script[^>]*>.*?</script>", setOf(RegexOption.DOT_MATCHES_ALL, RegexOption.IGNORE_CASE)), "") // Удаляем скрипты
            .replace(Regex("<style[^>]*>.*?</style>", setOf(RegexOption.DOT_MATCHES_ALL, RegexOption.IGNORE_CASE)), "") // Удаляем стили
            .replace(Regex("<iframe[^>]*>.*?</iframe>", setOf(RegexOption.DOT_MATCHES_ALL, RegexOption.IGNORE_CASE)), "") // Удаляем iframe
            .replace(Regex("<img[^>]*>", setOf(RegexOption.IGNORE_CASE)), "") // Удаляем изображения (они уже в imageUrl)
            .replace(Regex("<a[^>]*>", setOf(RegexOption.IGNORE_CASE)), "") // Удаляем ссылки, но оставляем текст
            .replace(Regex("</a>", setOf(RegexOption.IGNORE_CASE)), "")
            .replace(Regex("<p[^>]*>", setOf(RegexOption.IGNORE_CASE)), "\n") // Параграфы в переносы строк
            .replace(Regex("</p>", setOf(RegexOption.IGNORE_CASE)), "\n")
            .replace(Regex("<div[^>]*>", setOf(RegexOption.IGNORE_CASE)), "\n")
            .replace(Regex("</div>", setOf(RegexOption.IGNORE_CASE)), "\n")
            .replace(Regex("<br[^>]*/?>", setOf(RegexOption.IGNORE_CASE)), "\n") // Переносы строк
            .replace(Regex("<strong[^>]*>", setOf(RegexOption.IGNORE_CASE)), "**") // Жирный текст в markdown
            .replace(Regex("</strong>", setOf(RegexOption.IGNORE_CASE)), "**")
            .replace(Regex("<b[^>]*>", setOf(RegexOption.IGNORE_CASE)), "**")
            .replace(Regex("</b>", setOf(RegexOption.IGNORE_CASE)), "**")
            .replace(Regex("<em[^>]*>", setOf(RegexOption.IGNORE_CASE)), "*") // Курсив в markdown
            .replace(Regex("</em>", setOf(RegexOption.IGNORE_CASE)), "*")
            .replace(Regex("<i[^>]*>", setOf(RegexOption.IGNORE_CASE)), "*")
            .replace(Regex("</i>", setOf(RegexOption.IGNORE_CASE)), "*")
            .replace(Regex("<h[1-6][^>]*>", setOf(RegexOption.IGNORE_CASE)), "\n**") // Заголовки
            .replace(Regex("</h[1-6]>", setOf(RegexOption.IGNORE_CASE)), "**\n")
            .replace(Regex("<ul[^>]*>", setOf(RegexOption.IGNORE_CASE)), "\n")
            .replace(Regex("</ul>", setOf(RegexOption.IGNORE_CASE)), "\n")
            .replace(Regex("<ol[^>]*>", setOf(RegexOption.IGNORE_CASE)), "\n")
            .replace(Regex("</ol>", setOf(RegexOption.IGNORE_CASE)), "\n")
            .replace(Regex("<li[^>]*>", setOf(RegexOption.IGNORE_CASE)), "• ")
            .replace(Regex("</li>", setOf(RegexOption.IGNORE_CASE)), "\n")
            .replace(Regex("<[^>]+>"), "") // Удаляем остальные HTML теги
            .replace("&nbsp;", " ") // Заменяем HTML entities
            .replace("&amp;", "&")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&quot;", "\"")
            .replace("&#39;", "'")
            .replace("&apos;", "'")
            .replace("&mdash;", "—")
            .replace("&ndash;", "–")
            .replace("&hellip;", "...")
            .replace(Regex("\\n\\s*\\n\\s*\\n"), "\n\n") // Множественные переносы строк в двойные
            .replace(Regex("\\s+"), " ") // Множественные пробелы в один
            .trim()
        
        // Ограничиваем длину контента
        if (text.length > 1000) {
            text = text.substring(0, 1000) + "..."
        }
        
        return text
    }
}

