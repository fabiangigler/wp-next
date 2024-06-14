function a(t){return`json_decode(base64_decode('${s(JSON.stringify(t))}'), true)`}function c(t){const e={};for(const i in t)e[i]=a(t[i]);return e}function s(t){return u(new TextEncoder().encode(t))}function u(t){const e=String.fromCodePoint(...t);return btoa(e)}const $="8.0",n="/tmp/file.zip",f=async(t,e,i)=>{if(e instanceof File){const o=e;e=n,await t.writeFile(e,new Uint8Array(await o.arrayBuffer()))}const r=c({zipPath:e,extractToPath:i});await t.run({code:`<?php
        function unzip($zipPath, $extractTo, $overwrite = true)
        {
            if (!is_dir($extractTo)) {
                mkdir($extractTo, 0777, true);
            }
            $zip = new ZipArchive;
            $res = $zip->open($zipPath);
            if ($res === TRUE) {
                $zip->extractTo($extractTo);
                $zip->close();
                chmod($extractTo, 0777);
            } else {
                throw new Exception("Could not unzip file");
            }
        }
        unzip(${r.zipPath}, ${r.extractToPath});
        `}),await t.fileExists(n)&&await t.unlink(n)},p=async(t,e)=>{const i=`/tmp/file${Math.random()}.zip`,r=c({directoryPath:e,outputPath:i});await t.run({code:`<?php
		function zipDirectory($directoryPath, $outputPath) {
			$zip = new ZipArchive;
			$res = $zip->open($outputPath, ZipArchive::CREATE);
			if ($res !== TRUE) {
				throw new Exception('Failed to create ZIP');
			}
			$files = new RecursiveIteratorIterator(
				new RecursiveDirectoryIterator($directoryPath)
			);
			foreach ($files as $file) {
				$file = strval($file);
				if (is_dir($file)) {
					continue;
				}
				$zip->addFile($file, substr($file, strlen($directoryPath)));
			}
			$zip->close();
			chmod($outputPath, 0777);
		}
		zipDirectory(${r.directoryPath}, ${r.outputPath});
		`});const o=await t.readFileAsBuffer(i);return t.unlink(i),o};export{$ as RecommendedPHPVersion,f as unzipFile,p as zipDirectory};
