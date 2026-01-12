package com.newsaggregator.mainservice.dto

data class AuthResponse(
    val token: String,
    val userId: Long,
    val login: String,
    val email: String
)

