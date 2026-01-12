package com.newsaggregator.emailservice.service

import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailService(
    private val mailSender: JavaMailSender
) {
    fun sendEmail(to: String, subject: String, body: String) {
        val message = SimpleMailMessage()
        message.setTo(to)
        message.setSubject(subject)
        message.setText(body)
        message.setFrom("noreply@newsaggregator.com")
        
        try {
            mailSender.send(message)
        } catch (e: Exception) {
            // Логируем ошибку, но не прерываем выполнение
            println("Ошибка отправки email: ${e.message}")
        }
    }
}

