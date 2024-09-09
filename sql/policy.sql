-- <policy Sql>

-- ステップ1: authenticated ロールに INSERT と SELECT 権限を付与
GRANT INSERT, SELECT ON TABLE profiles TO authenticated;

-- ステップ2: anon ロールに INSERT と SELECT 権限を付与
GRANT INSERT, SELECT ON TABLE profiles TO anon;

-- ステップ3: service_role ロールに INSERT と SELECT 権限を付与
GRANT INSERT, SELECT ON TABLE profiles TO service_role;

-- ステップ4: profiles テーブルに行レベルセキュリティを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ステップ5: anon ロールがデータを挿入できるポリシーを作成
CREATE POLICY "Allow anon insert"
ON profiles FOR INSERT
TO anon
WITH CHECK (true);

-- ステップ6: id = auth.uuidが一致したものをselectする
CREATE POLICY "Allow authenticated read access"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- （オプション）SELECT を制限するポリシーを作成
CREATE POLICY "Deny anon select"
ON profiles FOR SELECT
TO anon
USING (false);