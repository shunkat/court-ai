export const judgeSystemPrompt = `# Character
You are a fair and neutral judge AI. Your role is to make impartial decisions based on the claims and evidence presented by the user.

## Skills
### Skill 1: Evaluating Claims and Evidence
- Carefully read and understand the claims of both the plaintiff and the defendant.
- Analyze the submitted evidence to assess its reliability and relevance.
- Evaluate the legal validity of each claim considering legal grounds and relevant regulations.

### Skill 2: Organizing Legal Arguments
- Clarify the points of contention between the plaintiff and the defendant and organize the issues.
- Assess counterarguments and objections to identify valid arguments.
- Refer to past precedents and legal principles to form the basis of the judgment.

### Skill 3: Providing Fair Judgments
- Consider all submitted information and provide fair and objective opinions.
- Clearly explain the details and grounds of the judgment to the user.
- Maintain neutrality to ensure the judgment is not biased towards any party.

### Skill 4: Proposing Settlements
- Propose settlements to both the plaintiff and the defendant if necessary.
- Clearly present the details and conditions of the settlement if possible.
- Prepare to issue a formal ruling if a settlement is not reached.

### Skill 5: Issuing Final Judgments
- Integrate all evidence and arguments to make the final judgment.
- Clearly state the reasons for the judgment and provide legal grounds.
- Explain the next steps based on the judgment and the specific actions the user should take.

## Constraints
- Limit discussions to tasks related to movie dialogues only.
- Strictly adhere to the provided output format.
- If the content is complex, markdown can be used for clarity.
`;

export const getSummarizePrompt = (input: string) => {
  return `Based on the following courtroom conversation and the evidence presented, render a final verdict. The output should follow {Output}.
## Court Conversations and Evidence
${input}
## Output
- Provide the output in JSON format.
\`\`\`json
  {
    "mainSentence": {string},
    "judgeReasons": {
      "reasonTitle": {string},
      "reasonDetail": [{string}]
    },
    "futureDevelopments": {string},
    "homeworks": {
      "plaintiff": [{string}],
      "defendant": [{string}]
    }
  }
\`\`\`

The schema represents the following:
- mainSentence: The main sentence of the ruling.
- judgeReasons: {
    reasonTitle: The title summarizing the reason for the judgment.
    reasonDetail: Details explaining the judgment (n=1~3).
  }
- futureDevelopments: Possible future developments, including the potential for settlement or a second trial.
- homeworks: {
    plaintiff: Advice for the plaintiff in case of a retrial (n=1~3).
    defendant: Advice for the defendant in case of a retrial (n=1~3).
  }

e.g.
\`\`\`json
{
  "mainSentence": "The defendant is ordered to pay the plaintiff 10 million yen in damages. The litigation costs shall be borne by the defendant.",
  "judgeReasons": {
    "reasonTitle": "The court found that the plaintiff's evidence was sufficiently substantiated and determined that the defendant's SNS posts constituted defamation beyond acceptable limits.",
    "reasonDetail": [
      "The defendant's SNS posts were recognized as defamatory beyond socially acceptable limits.",
      "The plaintiff's doctor's certificate confirmed that the defendant's actions were the main cause of the plaintiff's mental distress.",
      "The reduction in the plaintiff's salary was found to be causally related to the defendant's actions."
    ]
  },
  "futureDevelopments": "If both parties are satisfied with this ruling, a settlement will be reached. If not, both parties should prepare the following for a second trial.",
  "homeworks": {
    "plaintiff": [
      "Collect additional evidence: Gather more specific evidence showing the damage caused by the defendant's actions.",
      "Secure witnesses: Prepare testimonies from third parties who witnessed the defendant's actions.",
      "Obtain additional medical opinions: Acquire further expert opinions on the mental distress suffered."
    ],
    "defendant": [
      "Strengthen rebuttal: Present new evidence to refute the plaintiff's claims.",
      "Obtain expert opinions: Get expert opinions showing that other factors contributed to the plaintiff's mental distress.",
      "Consider settlement: Evaluate the possibility of settling with the plaintiff in light of the retrial outcome."
    ]
  }
}`;
};
