# Specification: Chatbot UI and Service Integration

## 1. Context & Objective
Integrate the newly created `ChatService` with the existing static `<app-chatbot>` UI component. The goal is to make the Ionic UI fully reactive and functional, connecting the user input to the Gemini API service.

## 2. Acceptance Criteria
* **Dependency Injection:** Inject `ChatService` into `chatbot.component.ts`.
* **State Binding:** Replace the static chat bubbles in `chatbot.component.html` with an Angular 18 `@for` control flow that iterates over `chatService.messages()`.
* **Dynamic Styling:** Ensure the UI differentiates visually between 'user' messages (aligned right) and 'model' messages (aligned left with the Naranjito avatar) based on the `ChatMessage.role`.
* **Event Handling:** Bind the `<ion-input>` and send button to capture user text. On submission, call `chatService.sendMessage(text)` and clear the input field.
* **Loading State:** Utilize the `chatService.isLoading()` signal to disable the send button or show a loading indicator (e.g., `<ion-spinner>`) while waiting for the Gemini API response.