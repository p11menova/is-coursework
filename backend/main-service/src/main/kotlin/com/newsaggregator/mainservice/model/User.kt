package com.newsaggregator.mainservice.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    val userId: Long = 0,
    
    @Column(name = "login", nullable = false, unique = true, length = 50)
    val login: String,
    
    @Column(name = "email", nullable = false, unique = true, length = 100)
    val email: String,
    
    @Column(name = "password_hash", nullable = false, length = 60)
    val passwordHash: String,
    
    @Column(name = "created_date", nullable = false)
    val createdDate: LocalDateTime = LocalDateTime.now()
)

