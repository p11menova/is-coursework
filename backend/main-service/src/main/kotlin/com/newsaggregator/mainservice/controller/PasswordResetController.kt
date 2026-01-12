package com.newsaggregator.mainservice.controller

import com.newsaggregator.mainservice.dto.ForgotPasswordRequest
import com.newsaggregator.mainservice.dto.ResetPasswordRequest
import com.newsaggregator.mainservice.service.PasswordResetService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth/password")
class PasswordResetController(
    private val passwordResetService: PasswordResetService
) {
    @PostMapping("/forgot")
    fun forgotPassword(@Valid @RequestBody request: ForgotPasswordRequest): ResponseEntity<Void> {
        return try {
            passwordResetService.requestPasswordReset(request)
            ResponseEntity.ok().build()
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        }
    }

    @PostMapping("/reset")
    fun resetPassword(@Valid @RequestBody request: ResetPasswordRequest): ResponseEntity<Void> {
        return try {
            passwordResetService.resetPassword(request)
            ResponseEntity.ok().build()
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        }
    }
}

