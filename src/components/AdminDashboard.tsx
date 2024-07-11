import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { PlusCircle, Edit, Trash2, Upload, ExternalLink } from 'lucide-react';

const mockFacilityData = {
  id: 1,
  name: "幸せの里動物保護施設",
  description: "当施設は、捨てられたり虐待されたりした動物たちを保護し、新しい家族との出会いをサポートしています。",
  address: "東京都新宿区XX-XX",
  phone: "03-XXXX-XXXX",
  email: "info@example.com",
  animals: [
    { id: 1, name: "ポチ", type: "犬", breed: "柴犬", age: 3, gender: "オス", image: "/api/placeholder/300/200?text=ポチ" },
    { id: 2, name: "ミケ", type: "猫", breed: "雑種", age: 2, gender: "メス", image: "/api/placeholder/300/200?text=ミケ" },
  ],
  supplies: [
    { id: 1, name: "ドッグフード", productName: "プレミアムドッグフード", current: 30, target: 100, unit: "kg", link: "https://www.amazon.co.jp/dp/B01N9JT3P7" },
    { id: 2, name: "猫砂", productName: "固まる猫砂", current: 50, target: 200, unit: "L", link: "https://www.amazon.co.jp/dp/B01MDONX91" },
  ]
};

const AdminDashboard = () => {
  const [facilityData, setFacilityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newAnimal, setNewAnimal] = useState({ name: '', type: '犬', age: '', gender: '不明', image: null });
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [newSupply, setNewSupply] = useState({
    name: '',
    productName: '',
    current: '',
    target: '',
    unit: '',
    link: ''
  });
  const [showSupplyForm, setShowSupplyForm] = useState(false);

  useEffect(() => {
    setFacilityData(mockFacilityData);
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="text-center mt-8">読み込み中...</div>;
  if (!facilityData) return <div className="text-center mt-8">データの読み込みに失敗しました。</div>;

  const handleFacilityInfoUpdate = (e) => {
    e.preventDefault();
    console.log("施設情報を更新しました");
  };

  const handleAnimalAdd = (e) => {
    e.preventDefault();
    console.log("新しい動物を追加しました", newAnimal);
    setFacilityData(prev => ({
      ...prev,
      animals: [...prev.animals, { ...newAnimal, id: Date.now() }]
    }));
    setNewAnimal({ name: '', type: '犬', age: '', gender: '不明', image: null });
    setShowAnimalForm(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAnimal(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSupplyAdd = (e) => {
    e.preventDefault();
    if (newSupply.link && !isValidAmazonUrl(newSupply.link)) {
      alert('有効なAmazonのURLを入力してください。');
      return;
    }
    setFacilityData(prev => ({
      ...prev,
      supplies: [...prev.supplies, { ...newSupply, id: Date.now() }]
    }));
    setNewSupply({ name: '', productName: '', current: '', target: '', unit: '', link: '' });
    setShowSupplyForm(false);
  };

  const isValidAmazonUrl = (url) => {
    return url.startsWith('https://www.amazon.co.jp/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">管理者ダッシュボード</h1>
      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">施設情報</TabsTrigger>
          <TabsTrigger value="animals">動物管理</TabsTrigger>
          <TabsTrigger value="supplies">物資管理</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>施設情報の編集</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFacilityInfoUpdate} className="space-y-4">
                {['name', 'description', 'address', 'phone', 'email'].map((field) => (
                  <div key={field}>
                    <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    <Input id={field} defaultValue={facilityData[field]} />
                  </div>
                ))}
                <Button type="submit">更新</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="animals">
          <Card>
            <CardHeader>
              <CardTitle>動物の管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facilityData.animals.map((animal) => (
                  <div key={animal.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <div className="flex items-center">
                      <img src={animal.image} alt={animal.name} className="w-16 h-16 object-cover rounded mr-4" />
                      <div>
                        <span className="font-bold">{animal.name}</span> - 
                        {animal.type}, {animal.age}歳, {animal.gender}
                      </div>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm" className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {!showAnimalForm && (
                <Button onClick={() => setShowAnimalForm(true)} className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> 動物を追加
                </Button>
              )}
              {showAnimalForm && (
                <form onSubmit={handleAnimalAdd} className="mt-4 space-y-4">
                  <Input
                    placeholder="名前"
                    value={newAnimal.name}
                    onChange={(e) => setNewAnimal(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Select
                    value={newAnimal.type}
                    onChange={(e) => setNewAnimal(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="犬">犬</option>
                    <option value="猫">猫</option>
                    <option value="その他">その他</option>
                  </Select>
                  <Input
                    type="number"
                    placeholder="年齢"
                    value={newAnimal.age}
                    onChange={(e) => setNewAnimal(prev => ({ ...prev, age: e.target.value }))}
                    required
                  />
                  <Select
                    value={newAnimal.gender}
                    onChange={(e) => setNewAnimal(prev => ({ ...prev, gender: e.target.value }))}
                  >
                    <option value="オス">オス</option>
                    <option value="メス">メス</option>
                    <option value="不明">不明</option>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                        <Upload className="h-4 w-4" />
                        <span>写真をアップロード</span>
                      </div>
                    </Label>
                    {newAnimal.image && (
                      <img src={newAnimal.image} alt="プレビュー" className="w-16 h-16 object-cover rounded" />
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">追加</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAnimalForm(false)}>キャンセル</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="supplies">
          <Card>
            <CardHeader>
              <CardTitle>必要物資の管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facilityData.supplies.map((supply) => (
                  <div key={supply.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <div>
                      <span className="font-bold">{supply.name}</span>
                      {supply.productName && <span className="italic"> - {supply.productName}</span>}
                      <br />
                      現在: {supply.current}{supply.unit}, 目標: {supply.target}{supply.unit}
                      {supply.link && (
                        <a href={supply.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">
                          <ExternalLink className="inline h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div>
                      <Button variant="ghost" size="sm" className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {!showSupplyForm && (
                <Button onClick={() => setShowSupplyForm(true)} className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> 物資を追加
                </Button>
              )}
              {showSupplyForm && (
                <form onSubmit={handleSupplyAdd} className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="supply-name">物資名</Label>
                    <Input
                      id="supply-name"
                      value={newSupply.name}
                      onChange={(e) => setNewSupply(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-name">商品名（任意）</Label>
                    <Input
                      id="product-name"
                      value={newSupply.productName}
                      onChange={(e) => setNewSupply(prev => ({ ...prev, productName: e.target.value }))}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="current-amount">現在量</Label>
                      <Input
                        id="current-amount"
                        type="number"
                        value={newSupply.current}
                        onChange={(e) => setNewSupply(prev => ({ ...prev, current: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="target-amount">目標量</Label>
                      <Input
                        id="target-amount"
                        type="number"
                        value={newSupply.target}
                        onChange={(e) => setNewSupply(prev => ({ ...prev, target: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="unit">単位</Label>
                      <Input
                        id="unit"
                        value={newSupply.unit}
                        onChange={(e) => setNewSupply(prev => ({ ...prev, unit: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="amazon-link">Amazon URL（任意）</Label>
                    <Input
                      id="amazon-link"
                      type="url"
                      value={newSupply.link}
                      onChange={(e) => setNewSupply(prev => ({ ...prev, link: e.target.value }))}
                      placeholder="https://www.amazon.co.jp/..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">追加</Button>
                    <Button type="button" variant="outline" onClick={() => setShowSupplyForm(false)}>キャンセル</Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
