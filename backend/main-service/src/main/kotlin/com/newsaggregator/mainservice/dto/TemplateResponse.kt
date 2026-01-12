package com.newsaggregator.mainservice.dto

data class TemplateResponse(
    val templateId: Long,
    val name: String,
    val description: String?,
    val categoryName: String?,
    val sourceNames: List<String>
)

