package com.newsaggregator.mainservice.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ResetPasswordRequest(
    @field:NotBlank(message = "Email обязателен")
    val email: String,
    
    @field:NotBlank(message = "Код обязателен")
    val code: String,
    
    @field:NotBlank(message = "Пароль обязателен")
    @field:Size(min = 6, message = "Пароль должен быть не менее 6 символов")
    val newPassword: String
)

