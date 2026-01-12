package com.newsaggregator.emailservice.controller

import com.newsaggregator.emailservice.service.EmailService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/email")
class EmailController(
    private val emailService: EmailService
) {
    @PostMapping("/send")
    fun sendEmail(@RequestBody request: Map<String, String>): ResponseEntity<Void> {
        val email = request["email"] ?: throw IllegalArgumentException("Email is required")
        val subject = request["subject"] ?: throw IllegalArgumentException("Subject is required")
        val body = request["body"] ?: throw IllegalArgumentException("Body is required")
        
        emailService.sendEmail(email, subject, body)
        return ResponseEntity.ok().build()
    }
}

