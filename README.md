# CDK v2 Billing Alert

It the repo showing how to create a billing alarm when the threshold in the billing crossed the limit. Now it is set for 5 USD.

The code is a part of blog post on securing and optimising AWS account usage. [Read on dev.to](https://dev.to/aws-builders/checklist-for-securing-the-usage-of-aws-account-from-unexpected-events-48e)

There are several steps to achieve a calm mind regarding your expenses in the cloud:


1. Set email with SSM, like:

```bash
aws ssm put-parameter --name "/billing/email" --type "String" --value "<your email>"
```

2. Clone the repo and install dependencies (in Linux/macOS case)

```bash
git clone https://github.com/Grenguar/cdk-billing-alert.git
cd cdk-billing-alert
cd infra
npm i
```

3. If you want to change the threshold, do it in the `infra/bin/infra.ts` file. There is a parameter called `monetaryLimit` 
4. Do the deployment:

```bash
npx cdk deploy
```
