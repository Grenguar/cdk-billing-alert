import { 
  Duration,
  Stack, 
  StackProps, 
  aws_cloudwatch as cloudwatch, 
  aws_cloudwatch_actions as cwa, 
  aws_sns as sns,
  aws_ssm as ssm
} from 'aws-cdk-lib';
import { EmailSubscription } from 'aws-cdk-lib/lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

export interface InfraStackProps extends StackProps {
  monetaryLimit: number;
}

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

    const billingAlarmTopic = new sns.Topic(this, 'BillingTopic', {
      topicName: 'billing-alarm-topic',
    });

    const email = ssm.StringParameter.valueForStringParameter(this, '/billing/email', 1);

    billingAlarmTopic.addSubscription(new EmailSubscription(email, {
      json: true,
    }));

    const billingAlarmMetric = new cloudwatch.Metric({
      metricName: 'EstimatedCharges',
      namespace: 'AWS/Billing',
      statistic: 'Maximum',
      dimensionsMap: {
        'Currency': 'USD',
      },
    }).with({
      period: Duration.hours(12),
    });

    const billingAlarm = new cloudwatch.Alarm(this, 'BillingCloudWatchAlarm', {
      alarmDescription: 'Alarm on billing when it is more than threshold',
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      metric: billingAlarmMetric,
      threshold: props.monetaryLimit,
    });

    const alarmAction = new cwa.SnsAction(billingAlarmTopic);

    billingAlarm.addAlarmAction(alarmAction);
  }
}
