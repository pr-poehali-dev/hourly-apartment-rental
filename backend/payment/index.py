import json
import os

def handler(event: dict, context) -> dict:
    '''API для обработки онлайн-платежей через Stripe'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
            
            apartment_id = body.get('apartment_id')
            apartment_title = body.get('apartment_title')
            price = body.get('price')
            hours = body.get('hours')
            total = body.get('total')
            customer_email = body.get('customer_email')
            
            if not all([apartment_id, apartment_title, price, hours, total, customer_email]):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'error': 'Заполните все обязательные поля',
                        'required': ['apartment_id', 'apartment_title', 'price', 'hours', 'total', 'customer_email']
                    }),
                    'isBase64Encoded': False
                }
            
            stripe_key = os.environ.get('STRIPE_SECRET_KEY')
            
            if not stripe_key:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'message': 'Тестовый режим: платёж успешно обработан',
                        'test_mode': True,
                        'booking_id': f'test_{apartment_id}_{hours}h',
                        'amount': total,
                        'details': {
                            'apartment': apartment_title,
                            'hours': hours,
                            'price_per_hour': price,
                            'total': total,
                            'customer': customer_email
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            try:
                import stripe
                stripe.api_key = stripe_key
                
                payment_intent = stripe.PaymentIntent.create(
                    amount=int(total * 100),
                    currency='rub',
                    description=f'Аренда: {apartment_title} на {hours} ч.',
                    receipt_email=customer_email,
                    metadata={
                        'apartment_id': apartment_id,
                        'hours': hours,
                        'price_per_hour': price
                    }
                )
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'client_secret': payment_intent.client_secret,
                        'payment_intent_id': payment_intent.id,
                        'amount': total,
                        'test_mode': False
                    }),
                    'isBase64Encoded': False
                }
                
            except Exception as e:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'error': f'Ошибка Stripe: {str(e)}'
                    }),
                    'isBase64Encoded': False
                }
                
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Некорректный формат JSON'
                }),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'error': 'Метод не поддерживается'
        }),
        'isBase64Encoded': False
    }
