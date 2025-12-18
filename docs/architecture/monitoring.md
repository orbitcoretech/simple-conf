# Monitoring

## Tools

| Aspect | Tool |
|--------|------|
| Process Management | PM2 |
| Application Logs | PM2 logs |
| Access Logs | Nginx |
| Server Metrics | htop, df, free |

## Commands

```bash
pm2 logs                      # Application logs
pm2 monit                     # Real-time monitoring
sudo tail -f /var/log/nginx/access.log
htop                          # Server resources
```

---
