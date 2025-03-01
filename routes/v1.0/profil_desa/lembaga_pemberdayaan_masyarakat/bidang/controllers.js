const { prisma } = require('../../../../../utilities/database')
const { ResponseError } = require('../../../../../utilities/response')
const { customAlphabet } = require('nanoid')
const fs = require("fs")

const getBidangById = async (req, res, next) => {
    try {
        const { gid, bidangId } = req.params

        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: gid
            }
        })

        if (!lembagaPemberdayaanMasyarakat) {
            return res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat is not found" })
        }

        const bidang = lembagaPemberdayaanMasyarakat.data_bidang.find(bidang => bidang.id === bidangId)

        if (!bidang) {
            return res.status(400).json({ message: "Bidang not found" })
        }

        res.status(200).json({ message: "Success", data: bidang })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const getAnggotaById = async (req, res, next) => {
    try {
        const { gid, bidangId, anggotaId } = req.params

        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: gid
            }
        })

        if (!lembagaPemberdayaanMasyarakat) {
            return res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat is not found" })
        }

        const bidang = lembagaPemberdayaanMasyarakat.data_bidang.find(bidang => bidang.id === bidangId)

        if (!bidang) {
            return res.status(400).json({ message: "Bidang not found" })
        }

        const anggota = bidang.data_anggota.find(anggota => anggota.id === anggotaId)

        if (!anggota) {
            return res.status(400).json({ message: "Anggota not found" })
        }

        res.status(200).json({ message: "Successfully.", data: anggota })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const createBidang = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { bidang } = req.body;
        const nanoIdCustom = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 3)

        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: id
            }
        })

        if (!lembagaPemberdayaanMasyarakat) {
            return res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat not found" })
        }

        const bidangExists = lembagaPemberdayaanMasyarakat.data_bidang.some(existingBidang => existingBidang.bidang === bidang)

        if (bidangExists) {
            return res.status(400).json({ message: "Bidang with the same name already exists" })
        }

        const newDataBidang = {
            id: nanoIdCustom(),
            bidang: bidang,
            data_anggota: []
        };

        await prisma.lembagaPemberdayaanMasyarakat.update({
            where: {
                id: id
            },
            data: {
                data_bidang: {
                    push: newDataBidang
                }
            }
        });

        res.status(200).json({ message: "Successfully." });
    } catch (error) {
        console.error('ERROR =>', error);
        next(new ResponseError(500, "Internal server error"));
    }
}

const updateBidang = async (req, res, next) => {
    try {
        const { gid, bidangId } = req.params
        const { bidang } = req.body

        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: gid
            }
        })

        if (!lembagaPemberdayaanMasyarakat) {
            return res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat is not found" })
        }

        const updatedBidang = lembagaPemberdayaanMasyarakat.data_bidang.find(bidang => bidang.id === bidangId)

        if (!updatedBidang) {
            return res.status(400).json({ message: "Bidang is not found" })
        }

        updatedBidang.bidang = bidang

        await prisma.lembagaPemberdayaanMasyarakat.update({
            where: {
                id: gid
            },
            data: {
                data_bidang: {
                    set: lembagaPemberdayaanMasyarakat.data_bidang
                }
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const createAnggotaBidang = async (req, res, next) => {
    try {
        const { gid, bidangId } = req.params
        const { nama_lengkap, jabatan, email, telp } = req.body
        const nanoIdCustom = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 3)
        const { filename, path } = req.file

        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: gid
            }
        })

        if (!lembagaPemberdayaanMasyarakat) {
            return res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat not found" })
        }

        const bidang = lembagaPemberdayaanMasyarakat.data_bidang.find(bidang => bidang.id === bidangId)

        if (!bidang) {
            return res.status(400).json({ message: "Bidang not found" });
        }

        const fileData = {
            filename: filename,
            path: path
        }

        fileData.path = fileData.path.replace(/\\/g, '/')

        const newDataAnggota = {
            id: nanoIdCustom(),
            nama_lengkap: nama_lengkap,
            jabatan: jabatan,
            email: email,
            telp: telp,
            img: fileData
        }

        bidang.data_anggota.push(newDataAnggota);

        await prisma.lembagaPemberdayaanMasyarakat.update({
            where: {
                id: gid
            },
            data: {
                data_bidang: {
                    set: lembagaPemberdayaanMasyarakat.data_bidang
                }
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error('ERROR =>', error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const updateAnggotaBidang = async (req, res, next) => {
    try {
        const { gid, bidangId, anggotaId } = req.params
        const { nama_lengkap, jabatan, email, telp } = req.body

        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: gid
            }
        })

        if (!lembagaPemberdayaanMasyarakat) {
            return res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat is not found" })
        }

        const bidang = lembagaPemberdayaanMasyarakat.data_bidang.find(bidang => bidang.id === bidangId)

        if (!bidang) {
            return res.status(400).json({ message: "Bidang not found" })
        }

        const updatedAnggota = bidang.data_anggota.find(anggota => anggota.id === anggotaId)

        if (!updatedAnggota) {
            return res.status(400).json({ message: "Anggota is not found" })
        }

        updatedAnggota.nama_lengkap = nama_lengkap
        updatedAnggota.jabatan = jabatan
        updatedAnggota.email = email
        updatedAnggota.telp = telp
        
        if (req.file) {
            const { filename, path } = req.file;
            if (updatedAnggota.img) {
                fs.unlinkSync(updatedAnggota.img.path);
            }
            updatedAnggota.img = { filename, path: path.replace(/\\/g, '/') }
        }


        await prisma.lembagaPemberdayaanMasyarakat.update({
            where: {
                id: gid
            },
            data: {
                data_bidang: {
                    set: lembagaPemberdayaanMasyarakat.data_bidang
                }
            }
        })

        res.status(200).json({ message: "Successfully." });
    } catch (error) {
        console.error("ERROR =>", error);
        next(new ResponseError(500, "Internal server error"));
    }
}

const removeBidang = async (req, res, next) => {
    try {
        const { gid, bidangId } = req.params

        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: gid
            }
        })

        if (!lembagaPemberdayaanMasyarakat) {
            return res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat is not found" })
        }

        const index = lembagaPemberdayaanMasyarakat.data_bidang.findIndex(bidang => bidang.id === bidangId)

        if (index === -1) {
            return res.status(400).json({ message: "Bidang is not found" });
        }

        const updatedDataBidang = [...lembagaPemberdayaanMasyarakat.data_bidang.slice(0, index), ...lembagaPemberdayaanMasyarakat.data_bidang.slice(index + 1)]

        await prisma.lembagaPemberdayaanMasyarakat.update({
            where: {
                id: gid
            },
            data: {
                data_bidang: {
                    set: updatedDataBidang
                }
            }
        })
        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const removeAnggotaBidang = async (req, res, next) => {
    try {
        const { gid, bidangId, anggotaId } = req.params

        const lembagaPemberdayaanMasyarakat = await prisma.lembagaPemberdayaanMasyarakat.findFirst({
            where: {
                id: gid
            }
        })

        if (!lembagaPemberdayaanMasyarakat) {
            return res.status(400).json({ message: "Lembaga Pemberdayaan Masyarakat is not found" })
        }

        const bidangIndex = lembagaPemberdayaanMasyarakat.data_bidang.findIndex(bidang => bidang.id === bidangId)

        if (bidangIndex === -1) {
            return res.status(400).json({ message: "Bidang not found" });
        }

        const bidang = lembagaPemberdayaanMasyarakat.data_bidang[bidangIndex]

        const anggotaIndex = bidang.data_anggota.findIndex(anggota => anggota.id === anggotaId);

        if (anggotaIndex === -1) {
            return res.status(400).json({ message: "Anggota is not found" });
        }

        const removedAnggota = bidang.data_anggota[anggotaIndex];

        if (removedAnggota.img) {
            fs.unlinkSync(removedAnggota.img.path);
        }

        const updatedDataAnggota = [
            ...bidang.data_anggota.slice(0, anggotaIndex),
            ...bidang.data_anggota.slice(anggotaIndex + 1)
        ];

        const updatedDataBidang = [...lembagaPemberdayaanMasyarakat.data_bidang];
        updatedDataBidang[bidangIndex].data_anggota = updatedDataAnggota;

        await prisma.lembagaPemberdayaanMasyarakat.update({
            where: {
                id: gid
            },
            data: {
                data_bidang: {
                    set: updatedDataBidang
                }
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

module.exports = {
    getBidangById,
    getAnggotaById,
    createBidang,
    updateBidang,
    createAnggotaBidang,
    updateAnggotaBidang,
    removeBidang,
    removeAnggotaBidang
}