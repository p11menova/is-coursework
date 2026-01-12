package com.newsaggregator.mainservice.dto

import java.time.LocalDateTime

data class NewsResponse(
    val newsId: Long,
    val title: String,
    val content: String,
    val url: String,
    val imageUrl: String?,
    val publishedDate: LocalDateTime,
    val sourceName: String,
    val categoryName: String,
    val isRead: Boolean = false
)

