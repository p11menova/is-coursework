package com.newsaggregator.mainservice.dto

data class SourceResponse(
    val sourceId: Long,
    val name: String,
    val url: String,
    val categoryName: String,
    val isSubscribed: Boolean = false
)

