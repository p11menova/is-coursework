package com.newsaggregator.mainservice.security

import org.springframework.security.core.context.SecurityContextHolder

object SecurityUtils {
    fun getCurrentUserId(): Long {
        val authentication = SecurityContextHolder.getContext().authentication
        return authentication?.principal as? Long
            ?: throw IllegalStateException("Пользователь не аутентифицирован")
    }
}

