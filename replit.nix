{pkgs}: {
  deps = [
    pkgs.yakut
    pkgs.nodejs
    pkgs.nodePackages.typescript-language-server
    pkgs.postgresql
  ];
}
