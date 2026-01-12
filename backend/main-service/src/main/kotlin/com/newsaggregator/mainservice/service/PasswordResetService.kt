package com.newsaggregator.mainservice.service

import com.newsaggregator.mainservice.dto.ForgotPasswordRequest
import com.newsaggregator.mainservice.dto.ResetPasswordRequest
import com.newsaggregator.mainservice.model.VerificationCode
import com.newsaggregator.mainservice.repository.UserRepository
import com.newsaggregator.mainservice.repository.VerificationCodeRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate
import java.security.SecureRandom
import java.time.LocalDateTime

@Service
class PasswordResetService(
    private val userRepository: UserRepository,
    private val verificationCodeRepository: VerificationCodeRepository,
    private val passwordEncoder: PasswordEncoder,
    private val restTemplate: RestTemplate,
    @Value("\${email.service.url:http://email-service:8081}") private val emailServiceUrl: String
) {
    private val random = SecureRandom()
    private val codeExpirationMinutes = 15L

    @Transactional
    fun requestPasswordReset(request: ForgotPasswordRequest) {
        val user = userRepository.findByEmail(request.email)
            ?: throw IllegalArgumentException("Пользователь с таким email не найден")

        // Генерируем код
        val code = generateVerificationCode()
        val codeHash = passwordEncoder.encode(code)

        // Сохраняем код (триггер удалит старый)
        val verificationCode = VerificationCode(
            user = user,
            codeHash = codeHash,
            expiresTime = LocalDateTime.now().plusMinutes(codeExpirationMinutes)
        )
        verificationCodeRepository.save(verificationCode)

        // Отправляем email через HTTP
        val emailRequest = mapOf(
            "email" to user.email,
            "subject" to "Восстановление пароля",
            "body" to """
                Здравствуйте!
                
                Вы запросили восстановление пароля для аккаунта ${user.login}.
                
                Ваш код восстановления: $code
                
                Код действителен в течение $codeExpirationMinutes минут.
                
                Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.
            """.trimIndent()
        )
        
        try {
            restTemplate.postForObject("$emailServiceUrl/api/email/send", emailRequest, String::class.java)
        } catch (e: Exception) {
            println("Ошибка отправки email: ${e.message}")
            // Не прерываем выполнение, код уже сохранен
        }
    }

    @Transactional
    fun resetPassword(request: ResetPasswordRequest) {
        val user = userRepository.findByEmail(request.email)
            ?: throw IllegalArgumentException("Пользователь с таким email не найден")

        val verificationCode = verificationCodeRepository.findByUserUserId(user.userId)
            ?: throw IllegalArgumentException("Код восстановления не найден")

        // Проверяем код
        if (!passwordEncoder.matches(request.code, verificationCode.codeHash)) {
            throw IllegalArgumentException("Неверный код восстановления")
        }

        // Проверяем срок действия
        if (verificationCode.expiresTime.isBefore(LocalDateTime.now())) {
            verificationCodeRepository.delete(verificationCode)
            throw IllegalArgumentException("Код восстановления просрочен")
        }

        // Обновляем пароль
        val updatedUser = user.copy(passwordHash = passwordEncoder.encode(request.newPassword))
        userRepository.save(updatedUser)

        // Удаляем код
        verificationCodeRepository.delete(verificationCode)
    }

    private fun generateVerificationCode(): String {
        val code = StringBuilder()
        for (i in 0 until 6) {
            code.append(random.nextInt(10))
        }
        return code.toString()
    }
}

