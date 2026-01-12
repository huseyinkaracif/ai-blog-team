import os
from crewai import Agent, Task, Crew, Process, LLM
from crewai.tools import BaseTool
from langchain_google_genai import ChatGoogleGenerativeAI
from duckduckgo_search import DDGS

# 1. AYARLAR
# Google API Anahtarını buraya gir (Eğer sistem değişkenlerinde yoksa)
os.environ["GOOGLE_API_KEY"] = "Api Key"
os.environ["OPENAI_API_KEY"] = "NA"
# --- 2. LLM TANIMLAMA (Güvenlik Filtreleri Kapalı) ---

# Gemini bazen internet verilerini "tehlikeli" sanıp yanıt vermeyi kesiyor.
# Bu ayarlar filtreleri tamamen kapatır ve modelin her zaman cevap vermesini sağlar.
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-lite",
    verbose=True,
    temperature=0.5,
    google_api_key=os.environ["GOOGLE_API_KEY"]
)

# --- 3. ÖZEL TOOL TANIMI ---
class InternetSearchTool(BaseTool):
    name: str = "Internet Search"
    description: str = "İnternette güncel konuları aramak için kullanılır."

    def _run(self, query: str) -> str:
        try:
            # max_results=3 yaparak modelin kafasının karışmasını önlüyoruz
            with DDGS() as ddgs:
                results = [r for r in ddgs.text(query, max_results=3)]
                return str(results)
        except Exception as e:
            return f"Arama hatası: {str(e)}"

search_tool = InternetSearchTool()

# --- 4. AJANLARI TANIMLA ---

researcher = Agent(
    role='Kıdemli Teknoloji Araştırmacısı',
    goal='Konu hakkında internetteki en güncel gelişmeleri bulmak.',
    backstory="""Teknoloji trendlerini takip eden araştırmacısın. 
    İnterneti tarayıp en doğru bilgiyi bulursun.""",
    verbose=True,
    allow_delegation=False,
    tools=[search_tool],
    llm=llm
)

writer = Agent(
    role='Teknoloji Blog Yazarı',
    goal='Araştırma verilerini kullanarak Türkçe blog yazısı yazmak.',
    backstory="""Karmaşık teknik konuları basit bir dile çevirirsin.""",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

editor = Agent(
    role='Baş Editör',
    goal='Yazıyı dilbilgisi ve yapısal olarak mükemmelleştirmek.',
    backstory="""Yazının Türkçe imla kurallarına uygunluğunu kontrol edersin.""",
    verbose=True,
    allow_delegation=False,
    llm=llm
)

# --- 5. GÖREVLERİ TANIMLA ---

task_research = Task(
    description="""'{topic}' konusu hakkında 2024-2025 yıllarındaki trendleri araştır.""",
    expected_output="Önemli noktaların bulunduğu özet rapor.",
    agent=researcher
)

task_write = Task(
    description="""Araştırma raporunu kullanarak '{topic}' hakkında blog yazısı yaz. Türkçe olsun.""",
    expected_output="Markdown formatında blog yazısı.",
    agent=writer
)

task_edit = Task(
    description="""Yazıyı kontrol et. Sonuna 'Yazar: AI Team' ekle.""",
    expected_output="Final blog yazısı.",
    agent=editor,
    output_file='final_makale_gemini.md'
)

# --- 6. ÇALIŞTIR ---

crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[task_research, task_write, task_edit],
    verbose=True,
    process=Process.sequential
)

if __name__ == "__main__":
    print("🤖 Yapay Zeka Ekibi Başlatılıyor...")
    # Konuyu biraz daha genel yapalım ki daha rahat veri bulsun
    topic = "Yapay Zeka (AI) Teknolojileri" 
    result = crew.kickoff(inputs={'topic': topic})

    print("\n########################")
    print("## İŞLEM TAMAMLANDI ##")
    print("########################\n")