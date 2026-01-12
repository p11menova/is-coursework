package com.newsaggregator.mainservice.repository

import com.newsaggregator.mainservice.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByLogin(login: String): User?
    fun findByEmail(email: String): User?
    fun existsByLogin(login: String): Boolean
    fun existsByEmail(email: String): Boolean
}

