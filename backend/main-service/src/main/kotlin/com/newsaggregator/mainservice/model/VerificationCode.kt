package com.newsaggregator.mainservice.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "verification_codes")
data class VerificationCode(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_id")
    val codeId: Long = 0,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    val user: User,
    
    @Column(name = "code_hash", nullable = false, length = 255)
    val codeHash: String,
    
    @Column(name = "expires_time", nullable = false)
    val expiresTime: LocalDateTime
)

