"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMProvider = exports.View = void 0;
var View;
(function (View) {
    View["HOME"] = "/";
    View["PROMPTS"] = "prompts";
    View["AGENTS"] = "agents";
    View["PERSONAS"] = "personas";
    View["CONTEXTS"] = "contexts";
    View["CREATE"] = "create";
    View["MY_PROMPTS"] = "/my-prompts";
    View["MY_AGENTS"] = "/my-agents";
    View["MY_PERSONAS"] = "/my-personas";
    View["MY_CONTEXTS"] = "/my-contexts";
    View["PROFILE"] = "profile";
})(View || (exports.View = View = {}));
var LLMProvider;
(function (LLMProvider) {
    LLMProvider["GEMINI"] = "gemini";
    LLMProvider["ANTHROPIC"] = "anthropic";
    LLMProvider["GROQ"] = "groq";
    LLMProvider["OLLAMA"] = "ollama";
    LLMProvider["HUGGINGFACE"] = "huggingface";
})(LLMProvider || (exports.LLMProvider = LLMProvider = {}));
