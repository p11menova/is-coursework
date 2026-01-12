package com.newsaggregator.mainservice.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class ForgotPasswordRequest(
    @field:NotBlank(message = "Email обязателен")
    @field:Email(message = "Некорректный email")
    val email: String
)

