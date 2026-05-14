resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "fitness-app-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "cpu_usage_user"
  namespace           = "FitnessApp/EC2"
  period              = 120
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "CPU usage exceeded 80%"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
  dimensions = {
    InstanceId = var.instance_id
  }
}

resource "aws_cloudwatch_metric_alarm" "high_memory" {
  alarm_name          = "fitness-app-high-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "mem_used_percent"
  namespace           = "FitnessApp/EC2"
  period              = 120
  statistic           = "Average"
  threshold           = 85
  alarm_description   = "Memory usage exceeded 85%"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  dimensions = {
    InstanceId = var.instance_id
  }
}

resource "aws_cloudwatch_metric_alarm" "app_errors" {
  alarm_name          = "fitness-app-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5XXError"
  namespace           = "FitnessApp/Application"
  period              = 60
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "More than 10 application errors in 1 minute"
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

resource "aws_sns_topic" "alerts" {
  name = "fitness-app-alerts"
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

resource "aws_cloudwatch_dashboard" "fitness_app" {
  dashboard_name = "FitnessApp-Overview"
  dashboard_body = jsonencode({
    widgets = [
      {
        type       = "metric"
        properties = {
          title  = "CPU Utilization"
          metrics = [["FitnessApp/EC2", "cpu_usage_user", "InstanceId", var.instance_id]]
          period = 300
          stat   = "Average"
          view   = "timeSeries"
        }
      },
      {
        type       = "metric"
        properties = {
          title  = "Memory Usage"
          metrics = [["FitnessApp/EC2", "mem_used_percent", "InstanceId", var.instance_id]]
          period = 300
          stat   = "Average"
          view   = "timeSeries"
        }
      },
      {
        type       = "metric"
        properties = {
          title  = "Application Errors"
          metrics = [["FitnessApp/Application", "5XXError"]]
          period = 60
          stat   = "Sum"
          view   = "timeSeries"
        }
      }
    ]
  })
}
