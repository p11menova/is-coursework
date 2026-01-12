package com.newsaggregator.mainservice.dto

import jakarta.validation.constraints.NotBlank

data class LoginRequest(
    @field:NotBlank(message = "Логин обязателен")
    val login: String,
    
    @field:NotBlank(message = "Пароль обязателен")
    val password: String
)

