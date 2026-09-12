"use client";

import React, { useState } from "react";
import { HelpCircle, X, Check, Search } from "lucide-react";
import { Question } from "../../types/product.types";

interface ProductQuestionsSectionProps {
  questions?: Question[];
  sellerName: string;
}

export const ProductQuestionsSection: React.FC<ProductQuestionsSectionProps> = ({
  questions = [],
  sellerName,
}) => {
  const [questionList, setQuestionList] = useState<Question[]>(
    questions.length > 0
      ? questions
      : [
          {
            id: "q-default-1",
            userName: "Elena Rostova",
            date: "September 02, 2026",
            question: "Does this product include future version updates and documentation?",
            answer:
              "Yes! All customers receive lifetime product updates and access to our comprehensive documentation and video guides.",
            answeredBy: `${sellerName} Support`,
            answerDate: "September 02, 2026",
          },
          {
            id: "q-default-2",
            userName: "Marcus Weber",
            date: "August 15, 2026",
            question: "Can this asset be used in commercial client projects without attribution?",
            answer:
              "Yes, our commercial license allows you to use this product for end-client deliverables and SaaS production applications without attribution.",
            answeredBy: `${sellerName} Support`,
            answerDate: "August 15, 2026",
          },
        ]
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredQuestions = questionList.filter(
    (q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.answer && q.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !questionText.trim()) return;

    const newQ: Question = {
      id: `q-${Date.now()}`,
      userName: name.trim(),
      date: "Just now",
      question: questionText.trim(),
      answer: "Thank you for your question! The author will review and post an answer shortly.",
      answeredBy: `${sellerName} Team`,
      answerDate: "Pending Review",
    };

    setQuestionList([newQ, ...questionList]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
      setName("");
      setQuestionText("");
    }, 1500);
  };

  return (
    <div id="product-questions-section" className="space-y-6 pt-6 border-t border-[#333333]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base md:text-lg font-medium text-white">Questions & Answers</h3>
          <p className="text-[13px] text-[#a8a8a8]">Have a query before purchasing? Ask {sellerName} directly.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 rounded border border-[#3e3e3e] bg-[#262626] hover:bg-[#333333] text-white px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5 text-[#009f7f]" />
          <span>Ask seller a question</span>
        </button>
      </div>

      {/* Search Filter for Questions */}
      {questionList.length > 2 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#737373]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full rounded border border-[#3e3e3e] bg-[#181818] pl-9 pr-3 py-2 text-xs text-white placeholder-[#737373] focus:border-[#009f7f] focus:outline-none"
          />
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-4">
        {filteredQuestions.map((item) => (
          <div
            key={item.id}
            className="rounded border border-[#333333] bg-[#212121] p-4 space-y-3"
          >
            {/* Question */}
            <div className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#262626] text-[10px] font-bold text-white border border-[#3e3e3e]">
                Q
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-[#a8a8a8] mb-0.5">
                  <span className="font-medium text-white">{item.userName}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>
                <p className="text-[13px] font-medium text-white">{item.question}</p>
              </div>
            </div>

            {/* Answer */}
            {item.answer && (
              <div className="flex items-start gap-2.5 pl-6 border-l-2 border-[#009f7f]/60 ml-2.5 mt-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#009f7f]/20 text-[10px] font-bold text-[#009f7f] border border-[#009f7f]/30">
                  A
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-[#a8a8a8] mb-0.5">
                    <span className="font-medium text-[#009f7f]">{item.answeredBy || sellerName}</span>
                    {item.answerDate && (
                      <>
                        <span>•</span>
                        <span>{item.answerDate}</span>
                      </>
                    )}
                  </div>
                  <p className="text-[13px] text-[#a8a8a8] leading-relaxed">{item.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded border border-[#333333] bg-[#212121] p-6 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#737373] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-semibold text-white mb-1">Ask Seller a Question</h3>
            <p className="text-xs text-[#a8a8a8] mb-4">
              Your inquiry will be sent directly to {sellerName}.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#009f7f]/20 text-[#009f7f]">
                  <Check className="h-6 w-6" />
                </div>
                <div className="text-sm font-medium text-white">Question Sent!</div>
                <div className="text-xs text-[#a8a8a8]">The seller will reply soon.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#a8a8a8] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maria Anders"
                    className="w-full rounded border border-[#3e3e3e] bg-[#181818] px-3 py-2 text-xs text-white placeholder-[#737373] focus:border-[#009f7f] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#a8a8a8] mb-1">Your Question</label>
                  <textarea
                    rows={4}
                    required
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Ask about features, compatibility, support, or licenses..."
                    className="w-full rounded border border-[#3e3e3e] bg-[#181818] px-3 py-2 text-xs text-white placeholder-[#737373] focus:border-[#009f7f] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded border border-[#3e3e3e] px-4 py-2 text-xs font-medium text-[#a8a8a8] hover:bg-[#262626] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-[#009f7f] hover:bg-[#018066] px-4 py-2 text-xs font-medium text-white transition-colors cursor-pointer"
                  >
                    Send Question
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

