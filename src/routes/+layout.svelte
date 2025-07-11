<script>
  import '../app.css';
</script>

<div class="min-h-screen bg-base-100">
  <header class="navbar bg-base-100 shadow-lg">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            ></path>
          </svg>
        </div>
        <ul
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li><a href="/">ホーム</a></li>
          <li><a href="/blog">ブログ</a></li>
          <li><a href="/books">書籍</a></li>
        </ul>
      </div>
      <a href="/" class="btn btn-ghost text-xl">Tech Shelf</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><a href="/">ホーム</a></li>
        <li><a href="/blog">ブログ</a></li>
        <li><a href="/books">書籍</a></li>
      </ul>
    </div>
    <div class="navbar-end">
      <a href="/login" class="btn btn-primary">ログイン</a>
    </div>
  </header>

  <main>
    <slot />
  </main>

  <footer class="footer footer-center p-10 bg-base-200 text-base-content">
    <aside>
      <p class="font-bold">Tech Shelf</p>
      <p>プログラミングと技術の学習プラットフォーム</p>
      <p>Copyright © 2024 - All right reserved</p>
    </aside>
  </footer>
</div>
