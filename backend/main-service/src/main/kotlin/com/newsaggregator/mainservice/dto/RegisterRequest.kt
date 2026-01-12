package com.newsaggregator.mainservice.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class RegisterRequest(
    @field:NotBlank(message = "Логин обязателен")
    @field:Size(min = 3, max = 50, message = "Логин должен быть от 3 до 50 символов")
    val login: String,
    
    @field:NotBlank(message = "Email обязателен")
    @field:Email(message = "Некорректный email")
    val email: String,
    
    @field:NotBlank(message = "Пароль обязателен")
    @field:Size(min = 6, message = "Пароль должен быть не менее 6 символов")
    val password: String
)

