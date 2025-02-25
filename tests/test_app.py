import unittest
from app import app

class AppTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_home_page(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Teste de Velocidade de Digitação', response.data)

    def test_save_result(self):
        response = self.app.post('/save_result', json={
            'user_id': 'test_user',
            'wpm': 50,
            'errors': 2
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'success', response.data)

if __name__ == '__main__':
    unittest.main()