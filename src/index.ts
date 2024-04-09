import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const app = express();

const generateRandomEmail = (suffix: string = ".test"): string => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let email = "";
  for (let i = 0; i < 10; i++) {
    email += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  email += `${suffix}@qp1.org`;
  return email;
};

const generateEmailsToFile = (
  filePath: string,
  numEmails: number,
  suffix?: string
): void => {
  const emails: string[] = [];
  for (let i = 0; i < numEmails; i++) {
    emails.push(generateRandomEmail(suffix));
  }
  const emailText = emails.join("\n");
  fs.writeFileSync(filePath, emailText);
  console.log(`Generated ${numEmails} random emails and saved to ${filePath}`);
};

app.get("/", (req: Request, res: Response) => {
  res.redirect("/generate-emails");
});

app.get("/generate-emails", (req: Request, res: Response) => {
  const numEmails = parseInt(req.query.numEmails as string) || 10;
  const suffix = req.query.suffix as string;
  const filePath = path.resolve(`${__dirname}/output.txt`);
  generateEmailsToFile(filePath, numEmails, suffix);

  res.download(filePath, "output.txt", (err) => {
    if (err) {
      console.error("Error while downloading the file:", err);
    } else {
      console.log(
        `Generated ${numEmails} random emails and saved to ${filePath}`
      );
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
