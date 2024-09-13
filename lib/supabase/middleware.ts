import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { ProtectedPaths } from '../constant';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getSession();
  const url = new URL(request.url);
  console.log("Current Pathname:", url.pathname); 

  // ログイン済みユーザーの処理
  if (data.session) {
    if (url.pathname === "/auth") {
      console.log("Redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));  
    }

    return supabaseResponse;

  } else {
    // 未ログインで、保護されたパスにアクセスしようとした場合
    if (ProtectedPaths.includes(url.pathname)) {
      return NextResponse.redirect(new URL(`/auth?next=${url.pathname}`, request.url));
    }

    return supabaseResponse;
  }
}
