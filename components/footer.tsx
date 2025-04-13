import { Link } from 'react-router'
import {
  Instagram,
  Facebook,
  MessageCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-pastel-cream py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-text-primary">연락처</h3>
            <div className="flex items-center space-x-2 text-text-secondary">
              <Phone size={16} />
              <span>010-1234-5678</span>
            </div>
            <div className="flex items-center space-x-2 text-text-secondary">
              <Mail size={16} />
              <span>info@yontanine.com</span>
            </div>
            <div className="flex items-start space-x-2 text-text-secondary">
              <MapPin size={16} className="mt-1 flex-shrink-0" />
              <span>서울특별시 강남구 테헤란로 123 연탄이네 빌딩 1층</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-text-primary">바로가기</h3>
            <div className="flex flex-col space-y-2">
              <Link
                to="/privacy"
                className="text-text-secondary hover:text-primary-foreground
                  transition-colors"
              >
                개인정보 처리방침
              </Link>
              <Link
                to="/terms"
                className="text-text-secondary hover:text-primary-foreground
                  transition-colors"
              >
                이용약관
              </Link>
              <Link
                to="/contact"
                className="text-text-secondary hover:text-primary-foreground
                  transition-colors"
              >
                문의하기
              </Link>
              <Link
                to="/faq"
                className="text-text-secondary hover:text-primary-foreground
                  transition-colors"
              >
                자주 묻는 질문
              </Link>
            </div>
          </div>

          {/* Social Media & Brand Note */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-text-primary">소셜 미디어</h3>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pastel-pink p-2 rounded-full
                  text-primary-foreground hover:bg-pastel-pink/80
                  transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pastel-blue p-2 rounded-full
                  text-accent-foreground hover:bg-pastel-blue/80
                  transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://pf.kakao.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pastel-peach p-2 rounded-full
                  text-secondary-foreground hover:bg-pastel-peach/80
                  transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
            <p className="text-text-secondary italic mt-4">
              강아지 미용의 모든 것, 연탄이네에서 책임집니다.
            </p>
          </div>
        </div>

        <div
          className="mt-8 pt-6 border-t border-gray-200 text-center
            text-text-secondary text-sm"
        >
          © 2025 연탄이네 애견미용실. 모든 권리 보유.
        </div>
      </div>
    </footer>
  )
}
