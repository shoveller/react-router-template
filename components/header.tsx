'use client'

import { useState } from 'react'
import { Link } from 'react-router'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CustomImage from './ui/Image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 버튼 라벨과 아이콘을 결정하는 함수
  const getButtonLabel = () => {
    if (isMenuOpen) {
      return '메뉴 닫기'
    }

    return '메뉴 열기'
  }

  const getMenuIcon = () => {
    if (isMenuOpen) {
      return <X size={24} />
    }

    return <Menu size={24} />
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div
        className="container mx-auto px-4 h-16 md:h-20 flex items-center
          justify-between"
      >
        <Link to="/" className="flex items-center">
          <CustomImage
            src="/placeholder.svg?height=40&width=40"
            alt="연탄이네 로고"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-lg md:text-xl font-bold text-text-primary">
            연탄이네
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/services"
            className="text-text-primary hover:text-primary-foreground
              transition-colors"
          >
            서비스 안내
          </Link>
          <Link
            to="/portfolio"
            className="text-text-primary hover:text-primary-foreground
              transition-colors"
          >
            포트폴리오
          </Link>
          <Link
            to="/reservation"
            className="text-text-primary hover:text-primary-foreground
              transition-colors"
          >
            예약하기
          </Link>
          <Link
            to="/mypage"
            className="text-text-primary hover:text-primary-foreground
              transition-colors"
          >
            마이페이지
          </Link>
          <Button
            variant="outline"
            className="bg-pastel-pink text-primary-foreground border-pastel-pink
              hover:bg-pastel-pink/80"
          >
            로그인
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={getButtonLabel()}
        >
          {getMenuIcon()}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/services"
              className="py-2 text-text-primary hover:text-primary-foreground
                transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              서비스 안내
            </Link>
            <Link
              to="/portfolio"
              className="py-2 text-text-primary hover:text-primary-foreground
                transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              포트폴리오
            </Link>
            <Link
              to="/reservation"
              className="py-2 text-text-primary hover:text-primary-foreground
                transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              예약하기
            </Link>
            <Link
              to="/mypage"
              className="py-2 text-text-primary hover:text-primary-foreground
                transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              마이페이지
            </Link>
            <Button
              variant="outline"
              className="w-full bg-pastel-pink text-primary-foreground
                border-pastel-pink hover:bg-pastel-pink/80"
              onClick={() => setIsMenuOpen(false)}
            >
              로그인
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
