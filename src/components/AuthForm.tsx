import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera } from 'lucide-react';

const ENTROPY_THRESHOLD = 80; // ビット

const calculatePasswordEntropy = (password) => {
  const charset = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
  };
  const poolSize = Object.values(charset).filter(Boolean).length * 26;
  return Math.log2(Math.pow(poolSize, password.length));
};

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  const handlePasswordChange = useCallback((e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const entropy = calculatePasswordEntropy(newPassword);
    setPasswordStrength(Math.min(100, (entropy / ENTROPY_THRESHOLD) * 100));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError('パスワードが一致しません');
      setIsLoading(false);
      return;
    }

    if (!isLogin && calculatePasswordEntropy(password) < ENTROPY_THRESHOLD) {
      setError('パスワードが十分に強力ではありません');
      setIsLoading(false);
      return;
    }

    try {
      // シミュレートされたAPI呼び出し
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(isLogin ? 'Login' : 'Register', { email, password });
      // 成功時の処理（例：ユーザーをダッシュボードにリダイレクト）
    } catch (err) {
      setError('認証に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handlePaste = async (e) => {
      e.preventDefault();
      try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          if (item.types.includes('image/png')) {
            const blob = await item.getType('image/png');
            // ここでQRコードを解析し、認証情報を抽出する処理を実装
            console.log('QRコードが検出されました。認証処理を開始します。');
          }
        }
      } catch (err) {
        console.error('クリップボードの読み取りに失敗しました:', err);
      }
    };

    formRef.current.addEventListener('paste', handlePaste);
    return () => formRef.current?.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto" ref={formRef}>
      <Tabs defaultValue="login" onValueChange={(value) => setIsLogin(value === 'login')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">ログイン</TabsTrigger>
          <TabsTrigger value="register">新規登録</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'ログイン'}
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="register">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="register-email">メールアドレス</Label>
              <Input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="register-password">パスワード</Label>
              <Input
                id="register-password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="mt-1"
              />
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="confirm-password">パスワード（確認）</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : '新規登録'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
      {error && (
        <Alert className="mt-4">
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Alert className="mt-6">
        <AlertTitle>QRコード認証</AlertTitle>
        <AlertDescription className="flex items-center">
          <Camera className="mr-2" />
          QRコード画像を貼り付けて簡単ログイン
        </AlertDescription>
      </Alert>
      <Alert className="mt-4">
        <AlertTitle>注意</AlertTitle>
        <AlertDescription>
          このサイトはデモです。実際の個人情報は入力しないでください。
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AuthForm;
