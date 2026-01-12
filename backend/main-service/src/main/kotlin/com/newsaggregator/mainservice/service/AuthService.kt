package com.newsaggregator.mainservice.service

import com.newsaggregator.mainservice.dto.AuthResponse
import com.newsaggregator.mainservice.dto.LoginRequest
import com.newsaggregator.mainservice.dto.RegisterRequest
import com.newsaggregator.mainservice.model.User
import com.newsaggregator.mainservice.repository.UserRepository
import com.newsaggregator.mainservice.security.JwtUtil
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtUtil: JwtUtil
) {
    @Transactional
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByLogin(request.login)) {
            throw IllegalArgumentException("Пользователь с таким логином уже существует")
        }
        if (userRepository.existsByEmail(request.email)) {
            throw IllegalArgumentException("Пользователь с таким email уже существует")
        }

        val user = User(
            login = request.login,
            email = request.email,
            passwordHash = passwordEncoder.encode(request.password)
        )

        val savedUser = userRepository.save(user)
        val token = jwtUtil.generateToken(savedUser.userId, savedUser.login)

        return AuthResponse(
            token = token,
            userId = savedUser.userId,
            login = savedUser.login,
            email = savedUser.email
        )
    }

    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByLogin(request.login)
            ?: throw IllegalArgumentException("Неверный логин или пароль")

        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw IllegalArgumentException("Неверный логин или пароль")
        }

        val token = jwtUtil.generateToken(user.userId, user.login)

        return AuthResponse(
            token = token,
            userId = user.userId,
            login = user.login,
            email = user.email
        )
    }
}

