package com.newsaggregator.mainservice.service

import com.newsaggregator.mainservice.dto.CategoryNewsResponse
import com.newsaggregator.mainservice.dto.NewsResponse
import com.newsaggregator.mainservice.model.News
import com.newsaggregator.mainservice.model.UserNews
import com.newsaggregator.mainservice.repository.CategoryRepository
import com.newsaggregator.mainservice.repository.NewsRepository
import com.newsaggregator.mainservice.repository.UserNewsRepository
import com.newsaggregator.mainservice.repository.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class NewsService(
    private val newsRepository: NewsRepository,
    private val categoryRepository: CategoryRepository,
    private val userNewsRepository: UserNewsRepository,
    private val userRepository: UserRepository
) {
    fun getNewsForUser(userId: Long, pageable: Pageable): Page<NewsResponse> {
        val newsPage = newsRepository.findNewsForUser(userId, pageable)
        
        return newsPage.map { news ->
            val userNews = userNewsRepository.findByUserIdAndNewsId(userId, news.newsId)
            // Используем логотип источника вместо картинки новости
            val logoUrl = getSourceLogoUrl(news.source.url)
            NewsResponse(
                newsId = news.newsId,
                title = news.title,
                content = news.content,
                url = news.url,
                imageUrl = logoUrl, // Логотип источника вместо картинки
                publishedDate = news.publishedDate,
                sourceName = news.source.name,
                categoryName = news.category.name,
                isRead = userNews?.isRead ?: false
            )
        }
    }

    fun getNewsByCategory(userId: Long, categoryName: String, pageable: Pageable): Page<NewsResponse> {
        val category = categoryRepository.findByName(categoryName)
            ?: throw IllegalArgumentException("Категория не найдена: $categoryName")
        
        // Получаем новости только из источников, на которые подписан пользователь, и только из нужной категории
        val allUserNews = newsRepository.findNewsForUser(userId, Pageable.unpaged()).content
        val filteredNews = allUserNews.filter { it.category.name == categoryName }
        
        // Создаем пагинацию вручную
        val start = pageable.pageNumber * pageable.pageSize
        val end = minOf(start + pageable.pageSize, filteredNews.size)
        val pagedNews = filteredNews.sortedByDescending { it.publishedDate }.subList(start, end)
        
        val userNewsMap = userNewsRepository.findByUserId(userId)
            .associateBy { it.news.newsId }
        
        return org.springframework.data.domain.PageImpl(
            pagedNews.map { news ->
                val userNews = userNewsMap[news.newsId]
                val logoUrl = getSourceLogoUrl(news.source.url)
                NewsResponse(
                    newsId = news.newsId,
                    title = news.title,
                    content = news.content,
                    url = news.url,
                    imageUrl = logoUrl, // Логотип источника вместо картинки
                    publishedDate = news.publishedDate,
                    sourceName = news.source.name,
                    categoryName = news.category.name,
                    isRead = userNews?.isRead ?: false
                )
            },
            pageable,
            filteredNews.size.toLong()
        )
    }

    fun getCategoriesWithNews(userId: Long): List<CategoryNewsResponse> {
        // Получаем только новости из источников, на которые пользователь ПОДПИСАН
        val newsList = newsRepository.findNewsForUser(userId, Pageable.unpaged()).content
        
        // Если нет новостей из подписанных источников, возвращаем пустой список
        if (newsList.isEmpty()) {
            return emptyList()
        }
        
        // Группируем по категориям и берем только те категории, у которых есть новости
        // Фильтруем только категории, где есть хотя бы одна новость из подписанных источников
        return newsList
            .groupBy { it.category.name }
            .filter { (_, news) -> news.isNotEmpty() } // Дополнительная проверка на всякий случай
            .map { (categoryName, news) ->
                val latestNews = news.maxByOrNull { it.publishedDate }
                CategoryNewsResponse(
                    categoryName = categoryName,
                    summary = latestNews?.title?.take(100) ?: "Нет новостей",
                    latestNewsDate = latestNews?.publishedDate?.toString()
                )
            }
            .sortedByDescending { it.latestNewsDate }
    }

    @Transactional
    fun markAsRead(userId: Long, newsId: Long) {
        val existing = userNewsRepository.findByUserIdAndNewsId(userId, newsId)
        if (existing != null) {
            // Обновляем существующую запись
            val updated = existing.copy(isRead = true)
            userNewsRepository.save(updated)
        } else {
            // Создаем новую запись если её нет
            val user = userRepository.findById(userId)
                .orElseThrow { IllegalArgumentException("Пользователь не найден") }
            val news = newsRepository.findById(newsId)
                .orElseThrow { IllegalArgumentException("Новость не найдена") }
            
            val userNews = UserNews(
                user = user,
                news = news,
                isRead = true
            )
            userNewsRepository.save(userNews)
        }
    }
    
    private fun getSourceLogoUrl(url: String): String? {
        // Получаем домен из URL
        val domain = try {
            val urlObj = java.net.URL(url)
            urlObj.host.replace("www.", "")
        } catch (e: Exception) {
            url
        }
        
        // Возвращаем URL логотипа через favicon API
        return "https://www.google.com/s2/favicons?domain=$domain&sz=64"
    }
}

