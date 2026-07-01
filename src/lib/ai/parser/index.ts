import {
  AIAction,
  CheckBalanceAction,
  TransferAction,
  AddTaskAction,
  GeneralChatAction,
} from "../actions";

const ACTIONS: AIAction[] = [
  new CheckBalanceAction(),
  new TransferAction(),
  new AddTaskAction(),
];

/**
 * Parses user input prompts and returns the first matching AIAction.
 * Falls back to GeneralChatAction if no specific match is found.
 */
export function parsePrompt(prompt: string): AIAction {
  const matched = ACTIONS.find((action) => action.canHandle(prompt));
  return matched || new GeneralChatAction();
}
