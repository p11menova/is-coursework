package com.newsaggregator.mainservice.repository

import com.newsaggregator.mainservice.model.VerificationCode
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface VerificationCodeRepository : JpaRepository<VerificationCode, Long> {
    fun findByUserUserId(userId: Long): VerificationCode?
}

