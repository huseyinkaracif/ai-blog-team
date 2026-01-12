# AI Blog Ekibi

CrewAI ve yapay zeka teknolojileri kullanılarak otomatik blog içeriği oluşturmak için geliştirilmiş akıllı çoklu-ajan sistemi.

## 🚀 Genel Bakış

AI Blog Ekibi, blog içeriğini araştırmak, yazmak ve düzenlemek için birden fazla yapay zeka ajanını kullanan gelişmiş bir uygulamadır. Proje şunlardan oluşur:

- **Backend**: Yapay zeka ajanlarını yönetmek için Python tabanlı CrewAI uygulaması
- **Frontend**: Vite ve Tailwind CSS ile modern React uygulaması
- **Protone**: Temel yapay zeka ekibi işlevselliğini gösteren prototip

## 📋 Özellikler

- **Çoklu-Ajan Sistemi**: Birlikte çalışan koordineli yapay zeka ajanları (Araştırmacı, Yazar, Editör)
- **Araştırma Otomasyonu**: DuckDuckGo entegrasyonu ile otomatik web araştırması
- **İçerik Üretimi**: Yapay zeka destekli blog yazısı yazımı
- **İçerik Düzenleme**: Otomatik yazım denetimi ve kalite kontrolü
- **Modern Arayüz**: Yapay zeka ekibini yönetmek için interaktif kontrol paneli
- **Sihirbaz Arayüzü**: Blog oluşturma için adım adım yapılandırma
- **Yürütme İzleme**: Ajan aktivitelerinin gerçek zamanlı takibi
- **Sonuç Görüntüleme**: Üretilen içeriği görüntüleme ve dışa aktarma

## 🏗️ Proje Yapısı

```
ai-blog-team/
├── backend/           # CrewAI ile Python backend
│   ├── crew_manager.py
│   ├── main.py
│   └── requirements.txt
├── frontend/          # React frontend uygulaması
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── store/
│   └── package.json
└── protone/           # Prototip uygulama
    ├── main.py
    └── README.md
```

## 🔧 Gereksinimler

- **Python**: 3.8 veya üzeri
- **Node.js**: 16 veya üzeri
- **npm** veya **yarn**
- **Google Gemini API Anahtarı** (yapay zeka işlevselliği için)

## 📦 Kurulum

### Backend Kurulumu

1. Backend dizinine gidin:
```bash
cd backend
```

2. Sanal ortam oluşturun:
```bash
python -m venv venv
```

3. Sanal ortamı aktif edin:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

4. Bağımlılıkları yükleyin:
```bash
pip install -r requirements.txt
```

5. API anahtarınızı uygun yapılandırma dosyasında ayarlayın

### Frontend Kurulumu

1. Frontend dizinine gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

## 🚀 Uygulamayı Çalıştırma

### Backend

Windows:
```bash
cd backend
run.bat
```

Veya manuel olarak:
```bash
cd backend
venv\Scripts\activate
python main.py
```

### Frontend

Windows:
```bash
cd frontend
run.bat
```

Veya manuel olarak:
```bash
cd frontend
npm run dev
```

Frontend `http://localhost:5173` adresinde erişilebilir olacaktır

## 🧪 Protone (Prototip)

Temel yapay zeka ekibi işlevselliğini test etmek için [protone dizinine](./protone/README.md) bakın.

Hızlı başlangıç:
```bash
cd protone
python -m venv crewai
crewai\Scripts\activate
pip install crewai crewai-tools langchain-google-genai langchain-community duckduckgo-search
python main.py
```

## 🛠️ Kullanılan Teknolojiler

### Backend
- **CrewAI**: Çoklu-ajan orkestrasyon framework'ü
- **LangChain**: LLM entegrasyonu ve araçları
- **Google Gemini**: Yapay zeka dil modeli
- **DuckDuckGo Search**: Web araştırma yetenekleri

### Frontend
- **React**: UI framework'ü
- **Vite**: Build aracı ve geliştirme sunucusu
- **Tailwind CSS**: Utility-first CSS framework'ü
- **Zustand**: State yönetimi

## 📝 Kullanım

1. Hem backend hem de frontend uygulamalarını başlatın
2. Web arayüzünü açın
3. Blog parametrelerinizi yapılandırmak için sihirbazda ilerleyin
4. Yapay zeka ekibini çalıştırın
5. Üretilen içeriği görüntüleyin ve dışa aktarın

## 🤖 Yapay Zeka Ajanları

- **Araştırmacı**: Güncel ve ilgili bilgiler için internette arama yapar
- **Yazar**: Araştırma verilerinden iyi yapılandırılmış blog yazıları oluşturur
- **Editör**: İçeriği dilbilgisi, stil ve kalite açısından inceler

## 🔐 Yapılandırma

- API anahtarları güvenli bir şekilde saklanmalıdır (ortam değişkenlerini kullanın)
- Backend yapılandırmasında ajan parametrelerini ayarlayın
- Frontend'de UI teması ve ayarlarını özelleştirin

## 🌐 API Uç Noktaları

Backend şunlar için RESTful API uç noktaları sağlar:
- Ekip yürütmesini başlatma/durdurma
- Ekip durumunu alma
- Sonuçları alma
- Ajanları ve görevleri yapılandırma

## 📄 Lisans

Detaylar için [LICENSE](./LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

Katkılar memnuniyetle karşılanır! Lütfen Pull Request göndermekten çekinmeyin.

## 📞 Destek

Sorunlar, sorular veya öneriler için lütfen repository'de bir issue açın.

---

**Not**: API anahtarlarınızı güvende tuttuğunuzdan ve asla versiyon kontrolüne commit etmediğinizden emin olun.
