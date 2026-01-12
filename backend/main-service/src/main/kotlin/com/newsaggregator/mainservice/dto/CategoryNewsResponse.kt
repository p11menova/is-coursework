package com.newsaggregator.mainservice.dto

data class CategoryNewsResponse(
    val categoryName: String,
    val summary: String,
    val latestNewsDate: String? = null
)

