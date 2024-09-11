import React from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/browser';
import { useQuery } from '@tanstack/react-query';

export default function useUser() {
    const initUser = {
        display_name: "",
        email: "",
        id: "",
        image_url: ""
    };
    
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const supabase = createSupabaseBrowser();

            const { data } = await supabase.auth.getSession();

            if (data.session?.user) {
                // fetch user information profile
                const { data: user, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", data.session.user.id)
                    .single();

                if (error) {
                    console.error('Error fetching user profile:', error);
                    return initUser; // エラーが発生した場合、初期値を返す
                }

                console.log(user, data);
                return user;
            }
            return initUser; // セッションがない場合、初期ユーザー情報を返す
        },
    });
}
