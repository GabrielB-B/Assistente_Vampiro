param(
  [string]$SourceDirectory = "C:\dev\Assistente_Vampiro\documentacao\02-design-experiencia\assets\clas\paletas-originais",
  [string]$OutputDirectory = "C:\dev\Assistente_Vampiro\apps\web\public\images\clans"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$assets = @(
  @{ Slug = "banu-haqim"; File = "banupalette-1536x1536.png"; Color = "B29D34" },
  @{ Slug = "brujah"; File = "brujahpalette-1536x1536.png"; Color = "C30011" },
  @{ Slug = "gangrel"; File = "gangrelpalette-1536x1536.png"; Color = "7E846B" },
  @{ Slug = "hecata"; File = "hecata-1536x1536.png"; Color = "F5EDF0" },
  @{ Slug = "lasombra"; File = "lasombrapalette.png"; Color = "201A28" },
  @{ Slug = "malkavian"; File = "malkavianpalette-1536x1536.png"; Color = "FCB0B3" },
  @{ Slug = "ministry"; File = "ministry_palette.png"; Color = "6BD425" },
  @{ Slug = "nosferatu"; File = "nosferatupalette.png"; Color = "404E51" },
  @{ Slug = "ravnos"; File = "ravnospalette.png"; Color = "F1A63C" },
  @{ Slug = "salubri"; File = "salubripalette.png"; Color = "E1FBFE" },
  @{ Slug = "toreador"; File = "toreadorpalette.png"; Color = "9F5D77" },
  @{ Slug = "tremere"; File = "tremerepalette.png"; Color = "CCB2DC" },
  @{ Slug = "tzimisce"; File = "tzimiscepalette.png"; Color = "B8C4BB" },
  @{ Slug = "ventrue"; File = "ventruepalette.png"; Color = "B09E4F" }
)

New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

foreach ($asset in $assets) {
  $sourcePath = Join-Path $SourceDirectory $asset.File
  $source = [System.Drawing.Bitmap]::new($sourcePath)
  try {
    $target = [System.Drawing.ColorTranslator]::FromHtml("#$($asset.Color)")
    $left = [math]::Floor($source.Width * 0.18)
    $right = [math]::Floor($source.Width * 0.70)
    $top = [math]::Floor($source.Height * 0.18)
    $bottom = [math]::Floor($source.Height * 0.60)
    $points = [System.Collections.Generic.List[System.Drawing.Point]]::new()

    for ($y = $top; $y -lt $bottom; $y++) {
      for ($x = $left; $x -lt $right; $x++) {
        $pixel = $source.GetPixel($x, $y)
        $distance = [math]::Abs($pixel.R - $target.R) +
          [math]::Abs($pixel.G - $target.G) +
          [math]::Abs($pixel.B - $target.B)
        if ($distance -eq 0) {
          $points.Add([System.Drawing.Point]::new($x, $y))
        }
      }
    }

    if ($points.Count -lt 100) {
      throw "Símbolo $($asset.Slug) não encontrado na cor #$($asset.Color)."
    }

    $minX = ($points | Measure-Object X -Minimum).Minimum
    $maxX = ($points | Measure-Object X -Maximum).Maximum
    $minY = ($points | Measure-Object Y -Minimum).Minimum
    $maxY = ($points | Measure-Object Y -Maximum).Maximum
    $padding = 16
    $output = [System.Drawing.Bitmap]::new(
      [int]($maxX - $minX + 1 + 2 * $padding),
      [int]($maxY - $minY + 1 + 2 * $padding),
      [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
    )
    try {
      foreach ($point in $points) {
        $pixel = $source.GetPixel($point.X, $point.Y)
        $output.SetPixel(
          $point.X - $minX + $padding,
          $point.Y - $minY + $padding,
          [System.Drawing.Color]::FromArgb(255, $pixel.R, $pixel.G, $pixel.B)
        )
      }
      $output.Save(
        (Join-Path $OutputDirectory "$($asset.Slug).png"),
        [System.Drawing.Imaging.ImageFormat]::Png
      )
    }
    finally {
      $output.Dispose()
    }
  }
  finally {
    $source.Dispose()
  }
}
