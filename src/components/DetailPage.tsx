import React, { useState, useEffect } from 'react';
import { Heart, Share2, MessageCircle, AlertTriangle, Gift, ExternalLink, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// モックデータ（実際の実装ではAPIから取得）
const mockFacilityData = {
  id: 1,
  name: "幸せの里動物保護施設",
  type: "保護施設",
  prefecture: "東京都",
  description: "当施設は、捨てられたり虐待されたりした動物たちを保護し、新しい家族との出会いをサポートしています。",
  image: "/api/placeholder/800/400?text=施設画像",
  animals: [
    { id: 1, name: "ポチ", type: "犬", breed: "柴犬", age: 3, gender: "オス", image: "/api/placeholder/400/300?text=ポチ" },
    { id: 2, name: "ミケ", type: "猫", breed: "雑種", age: 2, gender: "メス", image: "/api/placeholder/400/300?text=ミケ" },
  ],
  stats: [
    { month: '1月', adoptions: 5 },
    { month: '2月', adoptions: 7 },
    { month: '3月', adoptions: 10 },
    { month: '4月', adoptions: 8 },
    { month: '5月', adoptions: 12 },
    { month: '6月', adoptions: 15 },
  ],
  neededSupplies: [
    { 
      id: 1, 
      name: "ドッグフード", 
      current: 30, 
      target: 100, 
      unit: "kg", 
      link: "https://www.amazon.co.jp/dp/B01N9JT3P7",
      impact: "10kgで中型犬5匹を1週間養うことができます。",
      isUrgent: false
    },
    { 
      id: 2, 
      name: "猫砂", 
      current: 50, 
      target: 200, 
      unit: "L", 
      link: "https://www.amazon.co.jp/dp/B01MDONX91",
      impact: "20Lで10匹の猫のトイレを1週間維持できます。",
      isUrgent: true
    },
    { 
      id: 3, 
      name: "ペット用タオル", 
      current: 20, 
      target: 50, 
      unit: "枚", 
      link: "https://www.amazon.co.jp/dp/B08JSRTC4H",
      impact: "1枚で3匹の動物を乾かすことができます。",
      isUrgent: false
    },
  ],
  recentDonations: [
    { id: 1, name: "匿名さん", amount: "ドッグフード 5kg", date: "2024-06-26T15:30:00" },
    { id: 2, name: "Y.S.さん", amount: "猫砂 10L", date: "2024-06-26T14:45:00" },
    { id: 3, name: "匿名さん", amount: "¥5,000", date: "2024-06-26T13:20:00" },
  ]
};

const DetailPage = () => {
  const [facility, setFacility] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 実際の実装ではAPIからデータをフェッチ
    setFacility(mockFacilityData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="text-center mt-8">読み込み中...</div>;
  }

  if (!facility) {
    return <div className="text-center mt-8">施設が見つかりません。</div>;
  }

  const AnimalCard = ({ animal }) => (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedAnimal(animal)}>
      <CardContent className="p-4">
        <img src={animal.image} alt={animal.name} className="w-full h-48 object-cover rounded-lg mb-2" />
        <h3 className="font-bold">{animal.name}</h3>
        <p>{animal.breed} ({animal.age}歳, {animal.gender})</p>
      </CardContent>
    </Card>
  );

  const AdoptionChart = () => (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-2">月別譲渡数</h3>
      <div className="flex items-end h-40">
        {facility.stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="bg-blue-500 w-full" 
              style={{height: `${(stat.adoptions / Math.max(...facility.stats.map(s => s.adoptions))) * 100}%`}}
            ></div>
            <span className="text-xs mt-1">{stat.month}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const SupplyNeedCard = ({ supply }) => {
    const progress = (supply.current / supply.target) * 100;
    return (
      <Card className={`mb-4 ${supply.isUrgent ? 'border-red-500' : ''}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            {supply.name}
            {supply.isUrgent && <Badge variant="destructive">緊急</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-2" />
          <p className="text-sm mb-2">
            現在: {supply.current}{supply.unit} / 目標: {supply.target}{supply.unit}
          </p>
          <p className="text-xs text-gray-600 mb-2">{supply.impact}</p>
          <Button asChild className="w-full">
            <a href={supply.link} target="_blank" rel="noopener noreferrer">
              <Gift className="mr-2 h-4 w-4" /> Amazonで寄付する
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  };

  const RecentDonations = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">最近の寄付</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {facility.recentDonations.map(donation => (
            <li key={donation.id} className="text-sm">
              <span className="font-semibold">{donation.name}</span>さんが
              <span className="font-semibold">{donation.amount}</span>を寄付しました
              <br />
              <span className="text-xs text-gray-500">
                <Clock className="inline-block mr-1 h-3 w-3" />
                {new Date(donation.date).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{facility.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <img src={facility.image} alt={facility.name} className="w-full h-64 object-cover rounded-lg mb-4" />
          <p className="mb-4">{facility.description}</p>
          <div className="flex space-x-2 mb-4">
            <Button><Heart className="mr-2 h-4 w-4" /> お気に入り</Button>
            <Button><Share2 className="mr-2 h-4 w-4" /> シェア</Button>
            <Button><MessageCircle className="mr-2 h-4 w-4" /> 問い合わせ</Button>
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>注意</AlertTitle>
            <AlertDescription>
              動物の譲渡には審査が必要です。責任を持って最後まで飼育できることをご確認ください。
            </AlertDescription>
          </Alert>
          <h2 className="text-2xl font-bold my-4">保護動物一覧</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {facility.animals.map(animal => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4">譲渡実績</h2>
          <AdoptionChart />
        </div>
        <div>
          <Card className="bg-orange-50 border-orange-200 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-700">
                <Gift className="inline-block mr-2" /> 必要な支援物資
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-4">
                以下の物資が不足しています。皆様のご支援をお願いいたします。
              </p>
              {facility.neededSupplies.map(supply => (
                <SupplyNeedCard key={supply.id} supply={supply} />
              ))}
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <DollarSign className="mr-2 h-4 w-4" /> 金銭的な寄付をする
              </Button>
            </CardFooter>
          </Card>
          <RecentDonations />
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">ボランティア募集</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">動物のお世話や施設の管理をお手伝いいただけるボランティアを募集しています。</p>
              <Button className="w-full">詳細を見る</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {selectedAnimal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedAnimal.name}の詳細情報</h2>
            <img src={selectedAnimal.image} alt={selectedAnimal.name} className="w-full h-64 object-cover rounded-lg mb-4" />
            <p className="mb-4">{selectedAnimal.breed} ({selectedAnimal.age}歳, {selectedAnimal.gender})</p>
            <Tabs defaultValue="personality">
              <TabsList>
                <TabsTrigger value="personality">性格</TabsTrigger>
                <TabsTrigger value="health">健康状態</TabsTrigger>
                <TabsTrigger value="history">経歴</TabsTrigger>
              </TabsList>
              <TabsContent value="personality">おとなしく、人懐こい性格です。</TabsContent>
              <TabsContent value="health">健康状態は良好です。予防接種も済んでいます。</TabsContent>
              <TabsContent value="history">1ヶ月前に保護されました。元の飼い主の引っ越しが理由です。</TabsContent>
            </Tabs>
            <div className="mt-4 flex justify-between">
              <Button onClick={() => setSelectedAnimal(null)}>閉じる</Button>
              <Button>譲渡リクエスト</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPage;
