import { useState, useEffect, useCallback } from "react";
import './App.css';

// Sorular
const questions = [
  {
    question: "Çin Seddini oluşturan taşlar birbirine ne ile tutturulmuştur?",
    options: ["Bambu Harcı", "Anne Duası", "Pirinç Unu", "Noodle"],
    answer: "Pirinç Unu",
    media: "cin-seddi.jpg",
  },
  {
    question: "İlk Pamuk şekeri bulan kişinin mesleği nedir?",
    options: ["Gıda Mühendisi", "Diş Doktoru", "Ev Hanımı", "Güzellik Uzmanı"],
    answer: "Diş Doktoru",
    media: "pamuk.jpg",
  },
  {
    question: "Tarkan'ın 'Hüp' klibini izledikten sonra gaza gelip 'Tarkan keşke beni hüpletseydi' diye açıklamda bulunan kişi kimdir?",
    options: ["Gülben Ergen", "Hülya Avşar", "Harika Avcı", "Sevtap Parman"],
    answer: "Gülben Ergen",
    media: "tarkan.jpg",
  },
  {
    question: "Pteronofobi nedir?",
    options: ["Yeşil ışık yanar yanmaz korna çalacak korkusu", "Fakir kalma korkusu", "Taksi bulamama korkusu", "Kuş tüyüyle gıdıklanma korkusu"],
    answer: "Kuş tüyüyle gıdıklanma korkusu",
    media: "fobi.jpg",
  },
  {
    question: "Ortalama ömürleri 5 yıl olan Japon balıklarının en uzun yaşayanı Tish, bütün istatistikleri alt üst ederek kaç yıl boyunca hayata tutunmayı başarmıştır?",
    options: ["43", "78", "23", "99"],
    answer: "43",
    media: "balik.jpg",
  },
  {
    question: "90'lara damgasını vuran 'Bandıra Bandıra' şarkısının söz yazarı kimdir?",
    options: ["Sezen Aksu", "Sibel Can", "Mustafa Sandal", "Bülent Ersoy"],
    answer: "Mustafa Sandal",
    media: "bandira.jpg",
  },
  {
    question: "Hangi şarkıcımız yine kendisi gibi şarkıcı olan sevgilisinden ayrıldıktan sonra tam evinin karşısındaki apartmanın tamamını kendi posteriyle kaplatmıştır?",
    options: ["Hande Yener", "Hadise", "Gülşen", "Simge"],
    answer: "Hadise",
    media: "billboard.jpg",
  },
  {
    question: "Antik Roma'da kadınlar parfüm olarak ne kullanıyordu?",
    options: ["Gül Suyu", "Bal", "Gladyatör Teri", "Kan"],
    answer: "Gladyatör Teri",
    media: "parfum.jpg",
  },
  {
    question: "T-Rex'in yaşayan en yakın akrabası aşağıdakilerden hangisidir?",
    options: ["İnekler", "Tavuklar", "Timsahlar", "Köpekler"],
    answer: "Tavuklar",
    media: "trex.jpg",
  },
  {
    question: "Her şeyin olduğu gibi mutluluğun da fobisi varmış. Bu fobiye ne ad verilir?",
    options: ["Çerofobi", "Euphobia", "Felicifobia", "Mutluluk Korkusu"],
    answer: "Çerofobi",
    media: "fobi.jpg",
  },
];

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizEnded, setQuizEnded] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showNextButton, setShowNextButton] = useState(false);

  const QUESTION_TIMER = 30;

  const handleNextQuestion = useCallback(() => {
    setShowOptions(false);
    setShowNextButton(false);

    if (!selectedAnswer && !quizEnded) {
      const alreadyAnswered = userAnswers.find(
        (answers) => answers.question == questions[currentQuestion].question
      );

      if (!alreadyAnswered) {
        setUserAnswers((prevAnswers) => [
          ...prevAnswers,
          {
            question: questions[currentQuestion].question,
            userAnswer: "Boş Bırakıldı",
            correctAnswer: questions[currentQuestion].answer,
          },
        ]);
      }
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(QUESTION_TIMER);
      setSelectedAnswer("");
    } else {
      setQuizEnded(true);
      setQuizStarted(false);
    }
  }, [currentQuestion, selectedAnswer, quizEnded, userAnswers]);

  useEffect(() => {
    let timer;
    if (quizStarted && currentQuestion < questions.length) {
      const showOptionsTimeout = setTimeout(() => {
        setShowOptions(true);
      }, 4000);

      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleNextQuestion();
            return QUESTION_TIMER;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(showOptionsTimeout);
        clearInterval(timer);
      };
    }
  }, [quizStarted, currentQuestion]);

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
    setShowNextButton(true);
    if (option === questions[currentQuestion].answer) {
      setCorrectCount(correctCount + 1);
    }
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: questions[currentQuestion].question,
        userAnswer: option,
        correctAnswer: questions[currentQuestion].answer,
      },
    ]);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizEnded(false);
    setCurrentQuestion(0);
    setTimeLeft(QUESTION_TIMER);
    setCorrectCount(0);
    setUserAnswers([]);
  };

  return (
    <div className="App">
      {!quizStarted && !quizEnded ? (
        <div className="start-screen">
          <h1>Quiz Uygulamasına Hoş Geldiniz!</h1>
          <p>Testimiz 10 sorudan oluşmaktadır. Başladıktan sonra geçmiş sorulara dönemezsiniz ve her soru için 30 saniyeniz var. Hadi başlayalım!</p>
          <button className="start-button" onClick={startQuiz}>Teste Başla</button>
        </div>
      ) : quizEnded ? (
        <div className="result-screen">
          <h2>Test Sonucu</h2>
          <p>Doğru Cevap Sayısı: {correctCount}</p>
          <p>Yanlış Cevap Sayısı: {questions.length - correctCount}</p>
          <div className="answers-list">
            {userAnswers.map((answer, index) => (
              <div key={index} className={`answer-item ${answer.userAnswer === answer.correctAnswer ? "correct" : "incorrect"}`}>
                <p><strong>Soru:</strong> {answer.question}</p>
                <p><strong>Senin Cevabın:</strong> {answer.userAnswer}</p>
                {answer.userAnswer !== answer.correctAnswer && (
                  <p><strong>Doğru Cevap:</strong> {answer.correctAnswer}</p>
                )}
              </div>
            ))}
          </div>
          <button className="retry-button" onClick={startQuiz}>Tekrar Dene</button>
        </div>
      ) : (
        <div className="question-screen">
          <h2>Soru {currentQuestion + 1} / {questions.length}</h2>
          <h3>{questions[currentQuestion].question}</h3>
          <div className="selected-label">Seçilen cevap:</div>
          <div className="selected-answer">{selectedAnswer || "Henüz bir cevap seçilmedi."}</div>
          <img src={questions[currentQuestion].media} alt="Question" className="question-image" />
          {showOptions && (
            <div className="options">
              {questions[currentQuestion].options.map((option, index) => (
                <button key={index} className="option-button" onClick={() => handleAnswerSelect(option)}>
                  {option}
                </button>
              ))}
            </div>
          )}
          <div className="timer">
            <h3>Süre: {timeLeft} saniye</h3>
          </div>
          {showNextButton && (
            <button className="next-button" onClick={handleNextQuestion}>Sonraki Soru</button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
