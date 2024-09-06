-- <create insert_profile function>

-- ステップ1: Function作成
CREATE OR REPLACE FUNCTION insert_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles(id, email, display_name, image_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'email',
        
        -- COALESCEを使用してuser_nameがNULLの場合はnameを使用
        COALESCE(
            NEW.raw_user_meta_data ->> 'user_name', 
            NEW.raw_user_meta_data ->> 'name'
        ),
        
        NEW.raw_user_meta_data ->> 'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ステップ2: triggerの作成
CREATE TRIGGER trigger_insert_profile
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION insert_profile();

-- ステップ3: authenticated ロールに INSERT と SELECT 権限を付与
GRANT INSERT, SELECT ON TABLE profiles TO authenticated;

-- ステップ4: anon ロールに INSERT と SELECT 権限を付与
GRANT INSERT, SELECT ON TABLE profiles TO anon;

-- ステップ5: service_role ロールに INSERT と SELECT 権限を付与
GRANT INSERT, SELECT ON TABLE profiles TO service_role;

-- ステップ6: profiles テーブルに行レベルセキュリティを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ステップ7: anon ロールがデータを挿入できるポリシーを作成
CREATE POLICY "Allow anon insert"
ON profiles FOR INSERT
TO anon
WITH CHECK (true);

-- （オプション）SELECT を制限するポリシーを作成
CREATE POLICY "Deny anon select"
ON profiles FOR SELECT
TO anon
USING (false);


