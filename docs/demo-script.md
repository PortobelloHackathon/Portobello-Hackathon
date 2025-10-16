<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portobello Dashboard</title>
  <!-- Tailwind Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            portobelloBlue: '#0B1F52',   // dark blue
            portobelloGray: '#4B5563',   // dark gray (Tailwind gray-600)
          },
        },
      },
    };
  </script>
</head>
<body class="h-screen flex flex-col bg-gray-100">

  <!-- HEADER -->
  <header class="bg-gradient-to-r from-portobelloBlue via-gray-400 to-gray-300 text-white px-6 py-4 shadow-md">
    <div class="flex flex-col">
      <div class="flex items-baseline space-x-2">
        <h1 class="text-4xl font-bold tracking-wide">Portobello</h1>
        <span class="text-2xl font-light">America</span>
      </div>
      <div class="mt-1 text-sm text-gray-100 italic">
        Analytics
      </div>
    </div>
  </header>

  <!-- MAIN CONTAINER -->
  <div class="flex flex-1 overflow-hidden">

    <!-- SIDEBAR -->
    <aside class="w-48 bg-white border-r shadow-sm flex flex-col">
      <!-- Tab: Analytics -->
      <a href="#"
         class="px-4 py-3 text-portobelloBlue font-semibold uppercase tracking-wide relative group">
        <span class="block bg-portobelloBlue text-white px-3 py-2 skew-x-[-15deg]">
          <span class="block skew-x-[15deg]">Analytics</span>
        </span>
      </a>

      <!-- Tab: Inventory -->
      <a href="#"
         class="px-4 py-3 text-portobelloGray font-semibold uppercase tracking-wide relative group">
        <span class="block bg-gray-300 text-portobelloGray px-3 py-2 skew-x-[-15deg]">
          <span class="block skew-x-[15deg]">Inventory</span>
        </span>
      </a>

      <!-- More tabs can go here -->
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="flex-1 p-6 overflow-auto">
      <div class="text-gray-700 text-lg">
        <!-- Placeholder for dashboard content -->
        <p>Welcome to the Portobello Analytics Dashboard.</p>
      </div>
    </main>
  </div>

</body>
</html>