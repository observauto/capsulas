#!/usr/bin/env node

// Script to audit all capsules for completeness
const fs = require('fs');
const path = require('path');

const capsulesPath = path.join(__dirname, '../src/data/fullCapsules.ts');
const content = fs.readFileSync(capsulesPath, 'utf8');

// Extract FULL_CAPSULES array
const match = content.match(/export const FULL_CAPSULES: FullCapsule\[\] = \[([\s\S]*)\];/);
if (!match) {
    console.error('Could not find FULL_CAPSULES array');
    process.exit(1);
}

// Count capsules
const capsuleCount = (content.match(/slug: "/g) || []).length;
console.log(`\n📊 CAPSULE AUDIT REPORT`);
console.log(`=======================\n`);
console.log(`Total Capsules Found: ${capsuleCount}/18\n`);

// Extract each capsule slug and analyze
const slugMatches = content.matchAll(/slug: "([^"]+)"/g);
const capsules = [];

for (const match of slugMatches) {
    capsules.push(match[1]);
}

// Define expected structure
const expectedSections = ['intro', 'concept', 'tips', 'case', 'summary', 'quizIntro'];
const expectedMinQuizQuestions = 4;

// Analyze each capsule
capsules.forEach((slug, index) => {
    console.log(`\n${index + 1}. ${slug}`);

    // Find capsule block in file
    const capsuleStart = content.indexOf(`slug: "${slug}"`);
    const nextCapsuleStart = capsules[index + 1]
        ? content.indexOf(`slug: "${capsules[index + 1]}"`)
        : content.length;
    const capsuleBlock = content.substring(capsuleStart, nextCapsuleStart);

    // Check sections
    const hasSections = capsuleBlock.includes('sections: [');
    const sectionTypes = [];
    const sectionMatches = capsuleBlock.matchAll(/type: "([^"]+)"/g);
    for (const match of sectionMatches) {
        sectionTypes.push(match[1]);
    }

    // Check quiz
    const hasQuiz = capsuleBlock.includes('quiz: [');
    const quizQuestions = (capsuleBlock.match(/question: "/g) || []).length;

    // Check sponsors
    const hasSponsors = capsuleBlock.includes('sponsors: [');

    // Check difficulty
    const hasDifficulty = capsuleBlock.includes('difficulty:');

    // Report
    console.log(`   ✓ Sections: ${hasSections ? 'YES' : 'NO'} (${sectionTypes.length} total)`);
    console.log(`     Types: ${sectionTypes.join(', ')}`);
    console.log(`   ✓ Quiz: ${hasQuiz ? 'YES' : 'NO'} (${quizQuestions} questions)`);
    console.log(`   ✓ Sponsors: ${hasSponsors ? 'YES' : 'NO'}`);
    console.log(`   ✓ Difficulty: ${hasDifficulty ? 'YES' : 'NO'}`);

    // Warnings
    if (quizQuestions < expectedMinQuizQuestions) {
        console.log(`   ⚠️  WARNING: Quiz has fewer than ${expectedMinQuizQuestions} questions`);
    }
    if (!sectionTypes.includes('intro')) {
        console.log(`   ⚠️  WARNING: Missing intro section`);
    }
    if (!sectionTypes.includes('summary')) {
        console.log(`   ⚠️  WARNING: Missing summary section`);
    }
});

console.log(`\n=======================`);
console.log(`Audit Complete ✓\n`);
