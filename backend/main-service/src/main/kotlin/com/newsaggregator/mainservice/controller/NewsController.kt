package com.newsaggregator.mainservice.controller

import com.newsaggregator.mainservice.dto.CategoryNewsResponse
import com.newsaggregator.mainservice.dto.NewsResponse
import com.newsaggregator.mainservice.security.SecurityUtils
import com.newsaggregator.mainservice.service.NewsService
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/news")
class NewsController(
    private val newsService: NewsService
) {
    @GetMapping
    fun getNews(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<Page<NewsResponse>> {
        val userId = SecurityUtils.getCurrentUserId()
        val pageable: Pageable = PageRequest.of(page, size)
        val news = newsService.getNewsForUser(userId, pageable)
        return ResponseEntity.ok(news)
    }

    @GetMapping("/categories")
    fun getCategories(): ResponseEntity<List<CategoryNewsResponse>> {
        val userId = SecurityUtils.getCurrentUserId()
        val categories = newsService.getCategoriesWithNews(userId)
        return ResponseEntity.ok(categories)
    }

    @GetMapping("/category/{categoryName}")
    fun getNewsByCategory(
        @PathVariable categoryName: String,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<Page<NewsResponse>> {
        val userId = SecurityUtils.getCurrentUserId()
        val pageable: Pageable = PageRequest.of(page, size)
        val news = newsService.getNewsByCategory(userId, categoryName, pageable)
        return ResponseEntity.ok(news)
    }

    @PostMapping("/{newsId}/read")
    fun markAsRead(
        @PathVariable newsId: Long
    ): ResponseEntity<Void> {
        val userId = SecurityUtils.getCurrentUserId()
        newsService.markAsRead(userId, newsId)
        return ResponseEntity.ok().build()
    }
}

