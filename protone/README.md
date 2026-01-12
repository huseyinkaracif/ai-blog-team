# AI Blog Team Prototype

This is a prototype of an AI-powered blog writing team using CrewAI.

## Description

This project uses multiple AI agents working together to:
- Research current technology trends
- Write blog articles based on research
- Edit and finalize the content

The agents work sequentially to produce high-quality Turkish blog posts about technology topics.

## Prerequisites

- Python 3.8 or higher
- Google Gemini API Key

## Installation

1. Create and activate a virtual environment:
```bash
python -m venv crewai
crewai\Scripts\activate
```

2. Install required dependencies:
```bash
pip install crewai crewai-tools langchain-google-genai langchain-community duckduckgo-search
```

## Configuration

Before running the project, you need to set your Google Gemini API key:

1. Open `main.py`
2. Replace `"Api Key"` with your actual Google API key:
```python
os.environ["GOOGLE_API_KEY"] = "your-actual-api-key-here"
```

## Usage

Run the main script:
```bash
python main.py
```

The script will:
1. Start the AI crew
2. Research the given topic (currently: "Yapay Zeka (AI) Teknolojileri")
3. Write a blog post
4. Edit and finalize the content
5. Save the final article to `final_makale_gemini.md`

## Output

The final blog post will be saved in the file: `final_makale_gemini.md`

## Customization

To change the topic, edit the `topic` variable in `main.py`:
```python
topic = "Your Topic Here"
```

## Agents

- **Researcher**: Searches the internet for current information
- **Writer**: Creates blog posts from research data
- **Editor**: Reviews and perfects the final content

## License

See LICENSE file in the root directory.
