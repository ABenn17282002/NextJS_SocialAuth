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



